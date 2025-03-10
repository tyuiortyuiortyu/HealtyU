<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostSeeder extends Seeder{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
        $faker = \Faker\Factory::create();

        for ($i = 1; $i <= 10; $i++) {
            Post::create([
                'user_id' => $i,
                'title' => $faker->sentence(6, true),
                'description' => $faker->sentence(15, true),
                'content' => 'This is a placeholder for image content',
            ]);
        }
    }
}