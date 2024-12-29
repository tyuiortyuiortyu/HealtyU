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
        $faker = \Faker\Factory::create();
        $now = Carbon::now()->format('Y-m-d H:i:s');

        for ($i = 0; $i < 5; $i++) {
            DB::table('challenge_details')->insert([
            'challenge_id' => $faker->numberBetween(1, 10),
            'user_id' => $faker->numberBetween(1, 10),
            'start_date' => $faker->dateTimeBetween('now', '+1 year')->format('Y-m-d H:i:s'),
            'created_at' => $now,
            'updated_at' => $now
            ]);
        }
    }
}
