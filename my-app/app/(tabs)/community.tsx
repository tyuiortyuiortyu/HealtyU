import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ScrollView, } from "react-native";

import icons from "../../constants/icons";
import images from "../../constants/images";

const Community = () => {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: "1",
      name: "Nikita",
      profilePicture: "https://via.placeholder.com/100",
      postImage: "https://example.com/post1.jpg",
      caption: "This is a sample caption.",
      fullCaption: "This is a sample caption. Tap 'see more' to expand. Here is the full caption that gets displayed when expanded.",
      time: new Date(Date.now() - 3600 * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCaptionExpanded: false,
      isLiked: false,
      likes: 10,
      comments: 5,
    },
  ]);
  const [isNewPostScreenVisible, setIsNewPostScreenVisible] = useState(false);
  const [postText, setPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  const toggleCaption = (id) => {
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

  const handleLike = (id) => {
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

  // const handleComment = () => alert("Comment functionality coming soon!");
  // const handleShare = () => alert("Share functionality coming soon!");
  // const handleThreeDots = () => alert("Options functionality coming soon!");

  const handleComment = () => {
    setCommentModalVisible(true);
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const handleThreeDots = () => {
    setPopupVisible(true);
  };

  const handlePlusButtonPress = () => {
    setIsNewPostScreenVisible(true);
  };

  const handleCloseNewPostScreen = () => {
    setIsNewPostScreenVisible(false);
    setNewPostImage(null); // Clear image when closing the new post screen
  };

  // const handlePost = () => {
  //   console.log("Post submitted!");
  //   setIsNewPostScreenVisible(false);
  //   // Here you can handle posting the new image/caption
  // };

  const handlePost = () => {
    if (postText.trim()) {
      const newPost = {
        text: postText,
        image: newPostImage,
        id: Date.now(), // Unique ID for each post
      };

      setPosts([newPost, ...posts]); // Add the new post to the top of the list
    }
    setPostText(""); // Clear the input field
    setNewPostImage(null); // Clear the image
    setIsNewPostScreenVisible(false); // Close the new post screen
  };

  const handleAddImage = () => {
    console.log("Add image pressed");
    // Add logic for adding an image (perhaps open file picker)
    setNewPostImage("https://via.placeholder.com/300"); // Placeholder image for now
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f8f8f8" }}>
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
            <Image
              source={ icons.search}
              style={{ width: 20, height: 20, marginLeft: 20 }}
            />
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
            Hi Nikita, <Text style={{ fontSize: 20 }}>👋</Text>
          </Text>

          {/* Posts */}
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
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
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}
                  >
                    {item.name}
                  </Text>

                  <TouchableOpacity onPress={handleThreeDots}>
                    <Image source={icons.three_dots} 
                      style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    />
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
                    <Image
                      source={item.isLiked ? icons.fill_heart : icons.heart}
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: item.isLiked ? "red" : "gray",
                        marginRight: 5,
                      }}
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
                    <Image
                      source={icons.comment}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
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
                    <Image
                      source={icons.share}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
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
                onPress={() => setShareModalVisible(false)}
                style={{
                  marginTop: 20,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff" }}>Share on Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
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
                onChangeText={(text) => console.log(text)}
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
                  onPress={() => console.log("Edit Post")}
                  style={{ paddingVertical: 10 }}
                >
                  <Text>Edit Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => console.log("Delete Post")}
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
          {/* Header dengan tombol Close dan Post */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handleCloseNewPostScreen}>
              <Image
                source={icons.x}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: "#000",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePost}
              disabled={!postText.trim()}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: postText.trim() ? "#007BFF" : "#ccc",
                }}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>

          {/* Gambar yang ditambahkan */}
          {newPostImage && (
            <Image
              source={{ uri: newPostImage }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          )}

          {/* Input untuk teks */}
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

        {/* Tombol Add Image */}
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
          <Image
            source={images.add_image}
            style={{
              width: 35,
              height: 35,
              tintColor: "#fff",
            }}
          />
        </TouchableOpacity>
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
  );
};

export default Community;
