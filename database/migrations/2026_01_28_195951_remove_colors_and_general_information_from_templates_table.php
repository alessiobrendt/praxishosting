<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing colors and general_information to page_data
        $templates = DB::table('templates')->get();
        
        foreach ($templates as $template) {
            $pageData = [];
            
            // Merge colors into page_data
            if ($template->colors) {
                $colors = json_decode($template->colors, true);
                if (is_array($colors)) {
                    $pageData['colors'] = $colors;
                }
            }
            
            // Merge general_information into page_data
            if ($template->general_information) {
                $generalInfo = json_decode($template->general_information, true);
                if (is_array($generalInfo)) {
                    $pageData = array_merge($pageData, $generalInfo);
                }
            }
            
            // Merge existing page_data if it exists
            if ($template->page_data) {
                $existingPageData = json_decode($template->page_data, true);
                if (is_array($existingPageData)) {
                    $pageData = array_merge($existingPageData, $pageData);
                }
            }
            
            // Update the template with merged page_data
            DB::table('templates')
                ->where('id', $template->id)
                ->update([
                    'page_data' => json_encode($pageData),
                ]);
        }
        
        // Remove colors and general_information columns
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn(['colors', 'general_information']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->json('colors')->nullable()->after('slug');
            $table->json('general_information')->nullable()->after('colors');
        });
        
        // Try to restore colors and general_information from page_data
        $templates = DB::table('templates')->get();
        
        foreach ($templates as $template) {
            if ($template->page_data) {
                $pageData = json_decode($template->page_data, true);
                if (is_array($pageData)) {
                    $colors = $pageData['colors'] ?? null;
                    unset($pageData['colors']);
                    
                    DB::table('templates')
                        ->where('id', $template->id)
                        ->update([
                            'colors' => $colors ? json_encode($colors) : null,
                            'general_information' => !empty($pageData) ? json_encode($pageData) : null,
                        ]);
                }
            }
        }
    }
};
