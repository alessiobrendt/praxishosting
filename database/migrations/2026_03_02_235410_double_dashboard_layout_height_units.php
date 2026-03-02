<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Scale dashboard layout y and h by 2 so saved layouts use 40px row units.
     */
    public function up(): void
    {
        $users = DB::table('users')->whereNotNull('admin_dashboard_layout')->get(['id', 'admin_dashboard_layout']);
        foreach ($users as $user) {
            $layout = json_decode($user->admin_dashboard_layout, true);
            if (! is_array($layout)) {
                continue;
            }
            $updated = false;
            foreach ($layout as &$item) {
                if (isset($item['y'], $item['h'])) {
                    $item['y'] = (int) $item['y'] * 2;
                    $item['h'] = max(1, (int) $item['h'] * 2);
                    $updated = true;
                }
            }
            if ($updated) {
                DB::table('users')->where('id', $user->id)->update([
                    'admin_dashboard_layout' => json_encode(array_values($layout)),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $users = DB::table('users')->whereNotNull('admin_dashboard_layout')->get(['id', 'admin_dashboard_layout']);
        foreach ($users as $user) {
            $layout = json_decode($user->admin_dashboard_layout, true);
            if (! is_array($layout)) {
                continue;
            }
            $updated = false;
            foreach ($layout as &$item) {
                if (isset($item['y'], $item['h'])) {
                    $item['y'] = (int) floor($item['y'] / 2);
                    $item['h'] = max(1, (int) floor($item['h'] / 2));
                    $updated = true;
                }
            }
            if ($updated) {
                DB::table('users')->where('id', $user->id)->update([
                    'admin_dashboard_layout' => json_encode(array_values($layout)),
                ]);
            }
        }
    }
};
