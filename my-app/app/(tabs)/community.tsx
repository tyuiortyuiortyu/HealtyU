import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { ApiHelper } from "../helpers/ApiHelper";
import { CommunityResponse } from "../response/CommunityResponse";
import icons from "../../constants/icons";
import images from "../../constants/images";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.66.124:8081'; // disini bang

interface Post {
  id: number;
  name: string;
  profilePicture: string;
  postImage: string;
  caption: string;
  fullCaption: string;
  isCaptionExpanded: boolean;
  isLiked: boolean;
  likes: number;
  time: string;
}

interface Comment {
  id: number;
  text: string;
  username: string;
  time: string;
  user_id: number;
}

const Community = () => {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNewPostScreenVisible, setIsNewPostScreenVisible] = useState(false);
  const [postText, setPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState({ name: "", profilePicture: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      const parsedUserData = userData ? JSON.parse(userData) : { name: "Guest", profilePicture: "" };
      setCurrentUser({ name: parsedUserData.name, profilePicture: parsedUserData.profilePicture });
    };

    fetchUserData();
  }, []);

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
    console.log(posts)
  }, []);

  // getpost

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
  
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }
  
      const response = await fetch(`${API_BASE_URL}/api/community/getPosts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
  
      const responseData = await response.json();
      if (responseData?.error_schema.error_code != "S001") {
        throw new Error(responseData?.error_schema.error_message || "Failed to fetch posts.");
      }

      const transformedPosts: Post[] = responseData.output_schema.map((post) => ({
        id: post.id,
        name: post.user.name,
        profilePicture: post.user.profile_picture || "", // Jika null, default ke string kosong
        postImage: post.content, // Jika content adalah URL gambar
        caption: post.description?.length > 15 ? post.description.slice(0, 15) + "..." : post.description || "",
        fullCaption: post.description || "",
        isCaptionExpanded: false,
        isLiked: post.liked,
        likes: post.like_count,
        time: post.created_at, // Bisa diformat ulang jika perlu
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to fetch posts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  // likepost
  const handleLike = async (postId: number) => {
    try {
      const responseData = await ApiHelper.request(
        `${API_BASE_URL}/api/community/likePost`,
        "POST",
        { post_id: postId }
      ); // Jangan panggil .json() jika sudah berupa object

      if (responseData?.error_schema?.error_code !== "S001") {
        throw new Error(responseData?.error_schema?.error_message);
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: responseData.output_schema.isLiked,
                likes: responseData.output_schema.likes,
              }
            : post
        )
      );

    } catch (error) {
      Alert.alert("Error", error.message || "Failed to like post.");
    }
};

  

  // createpost
  const handlePost = async () => {
    try {
        const formData = new FormData();
        formData.append("description", postText || ""); // Pastikan tetap dikirim meskipun kosong

        if (newPostImage) {
            const fileType = newPostImage.split('.').pop()?.toLowerCase();
            const mimeType = fileType === "png" ? "image/png" :
                            fileType === "gif" ? "image/gif" :
                            "image/jpeg"; // Default ke jpeg

            formData.append("content", {
                uri: newPostImage,
                name: `photo.${fileType}`,
                type: mimeType,
            });
        }

        console.log("FormData:", formData);

        const response = await fetch(`${API_BASE_URL}/api/community/createPost`, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json", // Pastikan response dalam format JSON
            },
        });

        const responseData = await response.json();
        console.log("API Response:", responseData);

        if (responseData?.error_schema?.error_code !== "S001") {
            throw new Error(responseData?.error_schema?.additional_message || "Failed to create post.");
        }

        if (responseData.output_schema) {
            setPosts((prevPosts) => [...prevPosts, responseData.output_schema]);
            setPostText("");
            setNewPostImage(null);
            setIsNewPostScreenVisible(false);
        }
    } catch (error) {
        Alert.alert("Error", error.message || "Failed to create post", [{ text: "OK" }]);
    }
};





  const handleAddImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need gallery access to set profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setNewPostImage(result.assets[0].uri);
    }
  }, []);

  // deletepost
  const handleDeletePost = async (postId: number) => {
    console.log(postId);
    try {
        const response = await ApiHelper.request(
            `${API_BASE_URL}/api/community/deletePost/${postId}`,
            "DELETE"
        );

        console.log(response);

        if (response?.error_schema.error_code !== "S001") {
            throw new Error(response?.error_schema.additional_message);
        }

        // Pastikan post dihapus dari state
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
        Alert.alert("Error", error.message || "Failed to delete post", [{ text: "OK" }]);
    } finally {
        setPopupVisible(false);
    }
};


  const fetchComments = async (postId: number) => {
    try {
      const response = await ApiHelper.request(
        `${API_BASE_URL}/api/community/posts/${postId}/comments`,
        "GET"
      );
      
      console.log(response);

      if (response.output_schema) {
        const formattedComments: Comment[] = response.output_schema.map((item: any) => ({
          id: item.id,
          text: item.content, // Sesuaikan dengan `content` dari API
          username: item.user.name, // Ambil dari `user.name`
          time: new Date(item.created_at).toLocaleString(), // Format waktu
        }));
  
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: formattedComments, // Simpan berdasarkan `postId`
        }));
      }
    } catch (error) {
      setError(error.message || "Failed to fetch comments.");
    }
  };
  

  // addcomment
  const handleSendComment = async () => {
    if (commentText.trim() && selectedPostId !== null) {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const currentUser = userData ? JSON.parse(userData) : { name: "Guest" };

        const response = await ApiHelper.request(
          `${API_BASE_URL}/api/community/posts/${selectedPostId}/comments`,
          "POST",
          {
            content: commentText, // Format sesuai API
          }
        );
  
        if (response.output_schema) {
          const newComment: Comment = {
            id: response.output_schema.id,
            text: response.output_schema.content,
            username: currentUser.name, // Gunakan nama dari user yang sedang login
            time: new Date(response.output_schema.created_at).toLocaleString(),
            user_id: response.output_schema.user_id,
          };
  
          setComments((prevComments) => ({
            ...prevComments,
            [selectedPostId]: [...(prevComments[selectedPostId] || []), newComment],
          }));
  
          setCommentText("");
        }
      } catch (error) {
        setError(error.message || "Failed to create comment.");
      }
    }
  };
  
  

  // deletecomment
  const handleDeleteComment = async (postId: number | null, commentId: number) => {
    if (postId === null) return;
    console.log(postId, commentId)

    try {
      const response = await ApiHelper.request(
        `${API_BASE_URL}/api/community/posts/${postId}/comments/${commentId}`,
        "DELETE"
      );

      console.log(response);
  
      if (response?.error_schema.error_code === "S001") { // Pastikan API berhasil
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: prevComments[postId].filter((comment) => comment.id !== commentId),
        }));
      }
    } catch (error) {
      setError(error.message || "Failed to delete comment.");
    }
  };
  

  const toggleCaption = (id: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, isCaptionExpanded: !post.isCaptionExpanded }
          : post
      )
    );
  };

  const handleSearchPress = () => {
    setIsSearching(true);
  };

  const handleCancelSearch = () => {
    setSearchText("");
    setIsSearching(false);
  };

  const handleComment = (postId: number) => {
    setSelectedPostId(postId);
    fetchComments(postId);
    setCommentModalVisible(true);
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const handleThreeDots = (post: Post) => {
    setSelectedPost(post);
    setSelectedPostId(post.id);
    setPopupVisible(true);
  };

  const handlePlusButtonPress = () => {
    setIsNewPostScreenVisible(true);
  };

  const handleCloseNewPostScreen = () => {
    if (postText.trim() || newPostImage) {
      setIsLeaveModalVisible(true);
    } else {
      setIsNewPostScreenVisible(false);
    }
  };

  const handleLeaveWithoutSaving = () => {
    setIsNewPostScreenVisible(false);
    setPostText("");
    setNewPostImage(null);
    setIsLeaveModalVisible(false);
  };

  const handleCancelLeave = () => {
    setIsLeaveModalVisible(false);
  };

  const hideAllUpdatesFrom = (name: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.name !== name));
    setPopupVisible(false);
  };

  const onClose = () => {
    setCommentModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text style={{ color: "red", fontSize: 18 }}>{error}</Text>
        <TouchableOpacity onPress={fetchPosts} style={{ marginTop: 10 }}>
          <Text style={{ color: "blue", fontSize: 16 }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, padding: 20 }}>
          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
              marginBottom: 20,
            }}
          >
            <TextInput
              style={{ flex: 1, fontSize: 16 }}
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
            />
            {isSearching ? (
              <TouchableOpacity onPress={handleCancelSearch}>
                <Text style={{ color: "#007BFF", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSearchPress}>
                <MaterialIcons name="search" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>

          {/* Conditional: Searching or Default View */}
          {isSearching ? (
            <View>
              <Text style={{ fontSize: 16, color: "#666", marginBottom: 10 }}>
                Showing search results for: "{searchText}"
              </Text>
            </View>
          ) : (
            <>
              {/* Greeting */}
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
                Hi {currentUser.name}, <Text style={{ fontSize: 20 }}>👋</Text>
              </Text>

              {/* Posts */}
              <FlatList
                data={posts || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      padding: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 5,
                      elevation: 3,
                      marginBottom: 20,
                    }}
                  >
                    {/* Profile Info */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Image
                        source={{ uri: item.profilePicture }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                        }}
                      />
                      <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}>
                        {item.name}
                      </Text>

                      <TouchableOpacity onPress={() => handleThreeDots(item)}>
                        <MaterialIcons name="more-vert" size={24} color="black" />
                      </TouchableOpacity>
                    </View>

                    {/* Post Image */}
                    <Image
                      source={{ uri: item.postImage }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                    />

                    {/* Caption */}
                    <Text style={{ fontSize: 14, color: "#333", marginBottom: 10 }}>
                      {item.isCaptionExpanded ? item.fullCaption : item.caption}{" "}
                      <Text
                        style={{ color: "#007BFF" }}
                        onPress={() => toggleCaption(item.id)}
                      >
                        {item.isCaptionExpanded ? "see less" : "...see more"}
                      </Text>
                    </Text>

                    {/* Actions */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 15,
                        }}
                        onPress={() => handleLike(item.id)}
                      >
                        <MaterialIcons
                          name={item.isLiked ? "favorite" : "favorite-border"}
                          size={24}
                          color={item.isLiked ? "red" : "gray"}
                        />
                        <Text>{item.likes}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 15,
                        }}
                        onPress={() => handleComment(item.id)}
                      >
                        <MaterialIcons name="comment" size={24} color="gray" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 15,
                        }}
                        onPress={handleShare}
                      >
                        <MaterialIcons name="share" size={24} color="gray" />
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginLeft: "auto",
                          fontSize: 12,
                          color: "#888",
                        }}
                      >
                        {new Date(item.time).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                )}
              />

              {/* Share Modal */}
              <Modal
                visible={shareModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShareModalVisible(false)}
            >
                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 5,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Share this post
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            // Fungsi untuk share di Facebook
                            setShareModalVisible(false);
                        }}
                        style={{
                            backgroundColor: "#1877F2",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ color: "#fff" }}>Share on Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            // Fungsi untuk share di Instagram
                            setShareModalVisible(false);
                        }}
                        style={{
                            backgroundColor: "#E4405F",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ color: "#fff" }}>Share on Instagram</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            // Fungsi untuk share di WhatsApp
                            setShareModalVisible(false);
                        }}
                        style={{
                            backgroundColor: "#25D366",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ color: "#fff" }}>Share on WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            // Fungsi untuk copy link
                            setShareModalVisible(false);
                        }}
                        style={{
                            backgroundColor: "#007BFF",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ color: "#fff" }}>Copy Link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShareModalVisible(false)}
                        style={{
                            backgroundColor: "#ccc",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                        }}
                    >
                        <Text style={{ color: "#007BFF" }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

              {/* Comment Modal */}
              <Modal
                visible={commentModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
              >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                  <View style={{ backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Comments</Text>
                      <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="close" size={24} color="black" />
                      </TouchableOpacity>
                    </View>

                    {/* Daftar komentar */}
                    <FlatList
                      data={comments[selectedPostId] || []} // Ambil komentar dari state `comments`
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold" }}>{item.username}</Text>
                            <Text style={{ fontSize: 12, color: "#888" }}>{item.time}</Text>
                            {/* Tombol Hapus */}
                            <TouchableOpacity onPress={() => selectedPostId !== null && handleDeleteComment(selectedPostId, item.id)}>
                              <MaterialIcons name="delete" size={20} color="red" />
                            </TouchableOpacity>
                          </View>
                          <Text>{item.text}</Text>
                        </View>
                      )}
                      style={{ maxHeight: 300 }}
                    />



                    {/* Input untuk menulis komentar */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                      <TextInput
                        style={{ 
                          flex: 1, 
                          height: 40, 
                          borderColor: '#ccc', 
                          borderWidth: 1, 
                          borderRadius: 20, 
                          paddingLeft: 10, 
                          marginRight: 10 
                        }}
                        placeholder="Write a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                      />
                      <TouchableOpacity
                        style={{ 
                          backgroundColor: '#007BFF', 
                          padding: 10, 
                          borderRadius: 20, 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                        onPress={handleSendComment} // Kirim komentar untuk postingan yang dipilih
                      >
                        <MaterialIcons name="send" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* Popup Menu */}
              <Modal
                visible={popupVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPopupVisible(false)}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      padding: 20,
                      borderRadius: 10,
                      width: 200,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 5,
                      elevation: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleDeletePost(selectedPostId)}
                      style={{ paddingVertical: 10 }}
                    >
                      <Text>Delete Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setPopupVisible(false)}
                      style={{ paddingVertical: 10 }}
                    >
                      <Text>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>
          )}

          {/* New Post Modal */}
          <Modal visible={isNewPostScreenVisible} animationType="slide">
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
                backgroundColor: "#fff",
              }}
            >
              {/* Header with Close and Post buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={handleCloseNewPostScreen}>
                  <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePost}
                  disabled={!postText.trim() && !newPostImage}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: postText.trim() || newPostImage ? "#007BFF" : "#ccc",
                    }}
                  >
                    Post
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Image added */}
              {newPostImage && (
                <View style={{ position: "relative", marginTop: 10 }}>
                  <Image
                    source={{ uri: newPostImage }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 10,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setNewPostImage(null)}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: 15,
                      padding: 5,
                    }}
                  >
                    <MaterialIcons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Text input */}
              <TextInput
                style={{
                  height: 120,
                  marginTop: 10,
                  padding: 10,
                  fontSize: 16,
                  textAlignVertical: "top",
                }}
                placeholder="What's new"
                placeholderTextColor="#888"
                multiline
                value={postText}
                onChangeText={setPostText}
              />
            </ScrollView>

            {/* Add Image Button */}
            <TouchableOpacity
              onPress={handleAddImage}
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#2B4763",
                borderRadius: 25,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <MaterialIcons name="add-a-photo" size={24} color="#fff" />
            </TouchableOpacity>
          </Modal>

          {/* Leave without saving popup */}
          <Modal
            visible={isLeaveModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancelLeave}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  width: 300,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    marginBottom: 20,
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Leave without saving your post? Your changes won’t be saved.
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={handleCancelLeave}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "black" }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleLeaveWithoutSaving}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 20,
                      backgroundColor: "#ff4444",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "white" }}>Leave</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Floating Action Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              backgroundColor: "#2B4763",
              width: 50,
              height: 50,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handlePlusButtonPress}
          >
            <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Community;