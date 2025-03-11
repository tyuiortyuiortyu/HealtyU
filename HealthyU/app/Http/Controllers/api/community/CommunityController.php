<?php

namespace App\Http\Controllers\api\community;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PostLike;
use App\Models\Post;
use App\Models\Comment;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Helpers\ValidateJwt;
use App\Helpers\ApiResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CommunityController extends Controller
{

    public function createPost(Request $request) {
        $user = ValidateJwt::validateAndGetUser();
    
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }
    
        $validator = Validator::make($request->all(), [
            'description' => 'nullable|string|max:500',
            'content' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        if ($validator->fails()) {
            return ApiResponse::mapResponse(null, "E002", $validator->errors());
        }
    
        // Simpan gambar
        $imagePath = $request->file('content')->store('posts', 'public');
        $imageUrl = asset("storage/$imagePath"); // Buat URL lengkap
    
        // Simpan post
        $post = Post::create([
            'description' => $request->description,
            'content' => $imageUrl, // Simpan URL lengkap ke database
            'user_id' => $user->id,
        ]);
    
        // Ambil data post beserta user-nya
        $postWithUser = $post->load('user');
    
        return ApiResponse::mapResponse([
            'id' => $postWithUser->id,
            'description' => $postWithUser->description,
            'content' => $imageUrl, // Pastikan frontend menerima URL lengkap
            'user' => [
                'id' => $postWithUser->user->id,
                'name' => $postWithUser->user->name,
                'profilePicture' => asset("storage/{$postWithUser->user->profile_picture}"),
            ],
        ], "S001", "Post created successfully");
    }
    
    

    public function deletePost(Request $request, $id) {
        $user = ValidateJwt::validateAndGetUser();
    
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }
    
        $post = Post::where('id', $id)->where('user_id', $user->id)->first();
    
        if (!$post) {
            return ApiResponse::mapResponse(null, "E004", "Post not found or unauthorized");
        }
    
        // Hapus gambar jika ada
        if (!empty($post->content)) {
            $imagePath = 'public/' . $post->content; // Sesuaikan path dengan storage
            if (Storage::exists($imagePath)) {
                Storage::delete($imagePath);
            }
        }
    
        // Hapus post dari database
        $post->delete();
        
        return ApiResponse::mapResponse(null, "S001", "Post deleted successfully");
    }

    public function getComments(Request $request, $post_id) {
        $user = ValidateJwt::validateAndGetUser();
    
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }
    
        // Pastikan post ada
        $post = Post::find($post_id);
        if (!$post) {
            return ApiResponse::mapResponse(null, "E004", "Post not found");
        }
    
        // Ambil komentar berdasarkan post_id
        $comments = Comment::where('post_id', $post_id)
            ->with('user:id,name') // Ambil info user yang memberi komentar
            ->get();
    
        return ApiResponse::mapResponse($comments, "S001", "Comments retrieved successfully");
    }

    public function addComment(Request $request, $post_id) {
        $user = ValidateJwt::validateAndGetUser();

        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return ApiResponse::mapResponse(null, "E002", $validator->errors());
        }

        $post = Post::find($post_id);
        if (!$post) {
            return ApiResponse::mapResponse(null, "E004", "Post not found");
        }

        $comment = Comment::create([
            'post_id' => $post_id,
            'user_id' => $user->id,
            'content' => $request->content,
        ]);
    
        return ApiResponse::mapResponse($comment, "S001", "Comment added successfully");
    }

    public function deleteComment(Request $request, $post_id, $commentId) {
        $user = ValidateJwt::validateAndGetUser();
    
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }
    
        // Cari komentar berdasarkan ID dan pastikan user adalah pemilik komentar
        $comment = Comment::where('id', $commentId)->where('post_id', $post_id)->where('user_id', $user->id)->first();
    
        if (!$comment) {
            return ApiResponse::mapResponse(null, "E004", "Comment not found or unauthorized");
        }
    
        $comment->delete();
    
        return ApiResponse::mapResponse(null, "S001", "Comment deleted successfully");
    }

    public function likePost(Request $request) {
        $user = ValidateJwt::validateAndGetUser();
    
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }
    
        $validator = Validator::make($request->all(), [
            'post_id' => 'required|exists:posts,id',
        ]);
    
        if ($validator->fails()) {
            return ApiResponse::mapResponse(null, "E002", $validator->errors());
        }
    
        $postID = $request->post_id;
        $existLike = PostLike::where('user_id', $user->id)->where('post_id', $postID)->first();
    
        if ($existLike) {
            $existLike->delete();
            $isLiked = false;
        } else {
            PostLike::create([
                'user_id' => $user->id,
                'post_id' => $postID,
            ]);
            $isLiked = true;
        }
    
        // Hitung jumlah like terbaru
        $likeCount = PostLike::where('post_id', $postID)->count();
    
        return ApiResponse::mapResponse([
            'post_id' => $postID,
            'isLiked' => $isLiked,
            'likes' => $likeCount,
        ], "S001", $isLiked ? "Like post success" : "Unlike post success");
    }
    

    public function getPosts(Request $request) {
        $user = ValidateJwt::validateAndGetUser();
        
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }
    
        $posts = Post::with('user')->inRandomOrder()->take(10)->get()->map(function ($post) use ($user) {
            return [
                'id' => $post->id,
                'description' => $post->description,
                'content' => asset("storage/{$post->content}"), // Buat URL lengkap gambar post
                'liked' => PostLike::where('user_id', $user->id)->where('post_id', $post->id)->exists(),
                'like_count' => PostLike::where('post_id', $post->id)->count(),
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'profilePicture' => asset("storage/{$post->user->profile_picture}"), // URL lengkap foto profil
                ],
                'created_at' => $post->created_at,
            ];
        });
    
        return ApiResponse::mapResponse($posts, "S001");
    }
    
}