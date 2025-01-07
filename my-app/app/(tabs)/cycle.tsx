// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const Cycle = () => {
//   return (
//     <View>
//       <Text>Cycle</Text>
//     </View>
//   )
// }

// export default Cycle
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
} from "react-native";

const Community = () => {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: "1",
      name: "John Doe",
      profilePicture: "https://example.com/profile1.jpg",
      postImage: "https://example.com/post1.jpg",
      caption: "This is an amazing post!",
      fullCaption: "This is an amazing post! Really enjoyed my trip.",
      isCaptionExpanded: false,
      isLiked: false,
      likes: 10,
      comments: 5,
    },
  ]);
  const [isNewPostScreenVisible, setIsNewPostScreenVisible] = useState(false);
  const [newPostImage, setNewPostImage] = useState(null);

  const handleSearchPress = () => setIsSearching(true);

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchText("");
  };

  const toggleCaption = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, isCaptionExpanded: !post.isCaptionExpanded }
          : post
      )
    );
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

  const handleComment = () => alert("Comment functionality coming soon!");
  const handleShare = () => alert("Share functionality coming soon!");
  const handleThreeDots = () => alert("Options functionality coming soon!");

  const handlePlusButtonPress = () => setIsNewPostScreenVisible(true);
  const handleCloseNewPostScreen = () => setIsNewPostScreenVisible(false);
  const handlePost = () => {
    alert("Post functionality coming soon!");
    setIsNewPostScreenVisible(false);
  };
  const handleAddImage = () => alert("Add Image functionality coming soon!");

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
              source={{ uri: "https://example.com/search-icon.png" }}
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
                  style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                  <TouchableOpacity onPress={() => handleLike(item.id)}>
                    <Text style={{ color: item.isLiked ? "#007BFF" : "#333" }}>
                      {item.isLiked ? "Liked" : "Like"} ({item.likes})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleComment}>
                    <Text style={{ color: "#007BFF" }}>
                      Comment ({item.comments})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShare}>
                    <Text style={{ color: "#007BFF" }}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleThreeDots}>
                    <Text style={{ color: "#333" }}>...</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      {/* New Post Modal */}
      <Modal visible={isNewPostScreenVisible} animationType="slide">
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={handleCloseNewPostScreen}>
              <Text style={{ fontSize: 18 }}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePost}>
              <Text style={{ fontSize: 18, color: "#007BFF" }}>Post</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={{
              height: 120,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 10,
              padding: 10,
              backgroundColor: "#f2f2f2",
              fontSize: 16,
              textAlignVertical: "top",
            }}
            placeholder="Write something..."
            multiline
          />
          <TouchableOpacity
            onPress={handleAddImage}
            style={{ alignSelf: "flex-end", marginTop: 20 }}
          >
            <Text style={{ color: "#007BFF" }}>Add Image</Text>
          </TouchableOpacity>
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
        </ScrollView>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#007BFF",
          width: 60,
          height: 60,
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
