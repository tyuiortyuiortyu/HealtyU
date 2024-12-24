<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChallengeDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now()->setTimezone('Asia/Jakarta')->format('Y-m-d H:i:s');

        DB::table('challenge_detail')->insert([
            'challenge_id' => 1,
            'user_id' => 3,
            'start_date' => '2024-12-27 00:00:00',
            'created_at' => $now,
            'updated_at' => $now
        ]);
    }
}
