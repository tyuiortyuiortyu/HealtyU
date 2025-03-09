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

const API_BASE_URL = 'https://your-api-endpoint.com'; // disini bang

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
  comments: number;
  time: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser] = useState({
    name: "Guest",
    profilePicture: "",
  });

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await ApiHelper.request<CommunityResponse>(
        `${API_BASE_URL}/community/posts`,
        "GET"
      );

      if (response.output_schema) {
        setPosts(response.output_schema.posts);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch posts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async () => {
    try {
      const response = await ApiHelper.request(
        `${API_BASE_URL}/community/posts`,
        "POST",
        {
          name: currentUser.name,
          profilePicture: currentUser.profilePicture,
          postImage: newPostImage || "https://via.placeholder.com/300",
          caption: postText,
          fullCaption: postText,
        }
      );

      if (response.output_schema) {
        setPosts([response.output_schema.post, ...posts]);
        setPostText("");
        setNewPostImage(null);
        setIsNewPostScreenVisible(false);
      }
    } catch (error) {
      setError(error.message || "Failed to create post.");
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

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleLike = (id: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = () => {
    setCommentModalVisible(true);
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const handleThreeDots = (post: Post) => {
    setSelectedPost(post);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                data={posts}
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
                        onPress={handleComment}
                      >
                        <MaterialIcons name="comment" size={24} color="gray" />
                        <Text>{item.comments}</Text>
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
                        {item.time}
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
                onRequestClose={() => setCommentModalVisible(false)}
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
                    Add a comment
                  </Text>
                  <TextInput
                    style={{
                      height: 40,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      borderRadius: 5,
                      marginTop: 10,
                      paddingLeft: 10,
                    }}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                  />
                  <TouchableOpacity
                    onPress={() => setCommentModalVisible(false)}
                    style={{
                      marginTop: 20,
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#007BFF" }}>Close</Text>
                  </TouchableOpacity>
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
                      onPress={() => console.log("Hide this post")}
                      style={{ paddingVertical: 10 }}
                    >
                      <Text>Hide this post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedPost) {
                          hideAllUpdatesFrom(selectedPost.name);
                        }
                      }}
                      style={{ paddingVertical: 10 }}
                    >
                      <Text>Hide all updates from {selectedPost?.name}</Text>
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