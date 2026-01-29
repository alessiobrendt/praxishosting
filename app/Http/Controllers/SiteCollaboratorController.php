<?php

namespace App\Http\Controllers;

use App\Mail\SiteInvitationMail;
use App\Models\Site;
use App\Models\SiteInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class SiteCollaboratorController extends Controller
{
    public function index(Site $site): Response
    {
        $this->authorize('manageCollaborators', $site);

        $site->load('collaborators');

        return Inertia::render('sites/Collaborators', [
            'site' => $site,
        ]);
    }

    public function store(Request $request, Site $site): RedirectResponse
    {
        $this->authorize('manageCollaborators', $site);

        $validated = $request->validate([
            'email' => ['required', 'email'],
            'role' => ['sometimes', 'string', 'in:viewer,editor,admin'],
        ]);

        $email = $validated['email'];
        $role = $validated['role'] ?? 'editor';

        // Check if user is already owner
        if ($site->user->email === $email) {
            return back()->withErrors(['email' => __('Dieser Nutzer ist bereits der Besitzer.')]);
        }

        // Check if user exists
        $user = User::where('email', $email)->first();

        if ($user) {
            // User exists - add directly as collaborator
            if ($site->collaborators()->where('user_id', $user->id)->exists()) {
                return back()->withErrors(['email' => __('Dieser Nutzer ist bereits Mitbearbeiter.')]);
            }

            $site->collaborators()->attach($user->id, [
                'invited_by' => $request->user()->id,
                'invited_at' => now(),
            ]);

            return back()->with('success', __('Mitbearbeiter erfolgreich hinzugefügt.'));
        }

        // User doesn't exist - create invitation
        if ($site->invitations()->where('email', $email)->whereNull('accepted_at')->exists()) {
            return back()->withErrors(['email' => __('Eine Einladung wurde bereits an diese E-Mail-Adresse gesendet.')]);
        }

        $invitation = $site->invitations()->create([
            'email' => $email,
            'token' => SiteInvitation::generateToken(),
            'role' => $role,
            'invited_by' => $request->user()->id,
            'expires_at' => now()->addDays(7),
        ]);

        Mail::to($email)->send(new SiteInvitationMail($invitation));

        return back()->with('success', __('Einladung wurde erfolgreich gesendet.'));
    }

    public function destroy(Site $site, User $user): RedirectResponse
    {
        $this->authorize('manageCollaborators', $site);

        $site->collaborators()->detach($user->id);

        return back()->with('success', __('Mitbearbeiter erfolgreich entfernt.'));
    }

    public function destroyInvitation(Site $site, SiteInvitation $invitation): RedirectResponse
    {
        $this->authorize('manageCollaborators', $site);

        if ($invitation->site_id !== $site->id) {
            abort(403);
        }

        $invitation->delete();

        return back()->with('success', __('Einladung erfolgreich gelöscht.'));
    }
}
