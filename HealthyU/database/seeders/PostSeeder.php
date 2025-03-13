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

        Post::create([
            'user_id' => 32,
            'description' => "Kesehatan adalah harta yang paling berharga. Jangan tunda untuk hidup sehat mulai hari ini! #healthyiswealth #prioritaskansehat #healthyreminder",
            'content' => asset('storage/posts/1.jpg'),
        ]);

        Post::create([
            'user_id' => 2,
            'description' => "Ini bukan hanya tentang angka di timbangan. Ini tentang merasa lebih baik, memiliki lebih banyak energi, dan hidup lebih sehat. Perjalanan BMI saya adalah tentang membuat pilihan berkelanjutan yang memelihara tubuh dan pikiran saya.",
            'content' => asset('storage/posts/2.jpg'),
        ]);

        Post::create([
            'user_id' => 3,
            'description' => "Jangan seperti Little Miss Emergency Medicine — pastikan Anda sudah minum obat! #pengingat #obat-obatan #kesehatan",
            'content' => asset('storage/posts/3.jpg'),
        ]);

        Post::create([
            'user_id' => 4,
            'description' => "Pengingat obat untuk memprioritaskan kesehatan Anda! Apakah Anda sudah minum obat dan vitamin hari ini?",
            'content' => asset('storage/posts/4.jpg'),
        ]);

        Post::create([
            'user_id' => 33,
            'description' => "Jerawat membandel? Bye bye! Rahasianya? Pola makan sehat dan rutin mengontrol siklus datang bulan secara berkala. Kulit jadi glowing alami! #kulitsehat #jerawatgone #healthyskin",
            'content' => asset('storage/posts/5.jpg'),
        ]);

        Post::create([
            'user_id' => 31,
            'description' => "Gak nyangka, perubahan kecil bisa berdampak besar! Semenjak rutin olahraga dan makan sehat, badan terasa lebih enteng dan energik! #fitnessmotivation #energize #healthychanges",
            'content' => asset('storage/posts/6.jpg'),
        ]);

        Post::create([
            'user_id' => 1,
            'description' => "STRESS NGODING :v",
            'content' => asset('storage/posts/7.jpg'),
        ]);

        Post::create([
            'user_id' => 34,
            'description' => "Dulu, gue sering lupa minum vitamin. Sekarang semenjak rutin minum vitamin, badan jadi fit 24 jam. Lari 5K lancar! Semua berkat gaya hidup sehat dan rutin menginsumsi vitamin secara teratur. Gak nyesel! #transformasisehat #healthylifestyle #fitnessjourney #vitaminreminder",
            'content' => asset('storage/posts/8.jpg'),
        ]);

        Post::create([
            'user_id' => 35,
            'description' => "Dari yang gampang sakit-sakitan, sekarang jarang masuk angin! Semua berkat rajin berolahraga dan mengontrol BMI secara berkala.  #imunitaskuat #healthydiet #eatyourveggies",
            'content' => asset('storage/posts/9.jpg'),
        ]);

        Post::create([
            'user_id' => 10,
            'description' => "Gak nyangka, perubahan kecil bisa berdampak besar! Semenjak rutin olahraga dan makan sehat, badan terasa lebih enteng dan energik! #fitnessmotivation #energize #healthychanges",
            'content' => asset('storage/posts/10.jpg'),
        ]);
    }
}