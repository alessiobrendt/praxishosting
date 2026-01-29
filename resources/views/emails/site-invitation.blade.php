<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Einladung zur Site</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
        <h1 style="color: #2563eb; margin-top: 0;">Sie wurden eingeladen!</h1>
        
        <p>Hallo,</p>
        
        <p>
            {{ $invitation->inviter->name }} hat Sie eingeladen, als Mitbearbeiter an der Site 
            <strong>{{ $invitation->site->name }}</strong> mitzuarbeiten.
        </p>
        
        <div style="background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Site:</strong> {{ $invitation->site->name }}</p>
            <p style="margin: 5px 0;"><strong>Rolle:</strong> {{ ucfirst($invitation->role) }}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ route('register', ['token' => $invitation->token]) }}" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Einladung annehmen
            </a>
        </div>
        
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
            Diese Einladung ist 7 Tage gültig. Falls Sie kein Konto haben, können Sie sich nach dem Klick auf den Button registrieren.
        </p>
        
        <p style="font-size: 12px; color: #666;">
            Falls Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren.
        </p>
    </div>
</body>
</html>
