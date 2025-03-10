<?php

namespace Database\Seeders;

use App\Models\PostLike;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostLikeSeeder extends Seeder{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
        $faker = \Faker\Factory::create();

        for ($i = 1; $i <= 10; $i++) {
            PostLike::create([
                'post_id' => $i,
                'user_id' => $i,
            ]);
        }
    }
}