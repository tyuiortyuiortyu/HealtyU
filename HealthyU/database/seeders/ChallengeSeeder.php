<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ChallengeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $now = Carbon::now()->format('Y-m-d H:i:s');

        DB::table('challenges')->insert([
            'name' => 'Step Towards Rewards',
            'description' => 'Walk 5000 steps to unlock exciting rewards. Each step you take brings you closer to a healthier lifestyle—keep moving and enjoy the benefits!',
            'image' => $faker->imageUrl(640,480,'walk'),
            'created_at' => $now,
            'updated_at' => $now
        ]);
        
        for ($i = 0; $i < 20; $i++) {
            DB::table('challenges')->insert([
            'name' => $faker->sentence(3),
            'description' => $faker->paragraph,
            'image' => $faker->imageUrl(640, 480, 'challenge'),
            'created_at' => $now,
            'updated_at' => $now
            ]);
        }
    }
}
