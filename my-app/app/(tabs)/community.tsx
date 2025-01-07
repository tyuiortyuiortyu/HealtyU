import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import icons from "../../constants/icons";

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false); // Modal untuk comment
  const [popupVisible, setPopupVisible] = useState(false); // Popup for three dots
  const [posts, setPosts] = useState([
    {
      id: "1",
      profilePicture: "https://via.placeholder.com/100",
      name: "Nikita",
      postImage: "https://via.placeholder.com/300",
      caption: "This is a sample caption. Tap 'see more' to expand.",
      fullCaption:
        "This is a sample caption. Tap 'see more' to expand. Here is the full caption that gets displayed when expanded.",
      time: new Date(Date.now() - 3600 * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      likes: 10,
      comments: 5,
      isCaptionExpanded: false,
      isLiked: false,
    },
  ]);

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
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleComment = () => {
    setCommentModalVisible(true); // Tampilkan modal comment
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const handleThreeDots = () => {
    setPopupVisible(true); // Show popup when three dots are clicked
  };

  const handleSearch = () => {
    console.log("Search pressed!");
    // Implement your search functionality here
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: "#f9f9f9",
      }}
    >
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
        <TouchableOpacity onPress={handleSearch}>
          <Image
            source={icons.search}
            style={{ width: 20, height: 20, marginLeft: 20 }}
          />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
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
            {/* Header */}
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
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  flex: 1,
                }}
              >
                {item.name}
              </Text>
              <TouchableOpacity onPress={handleThreeDots}>
                <Text style={{ fontSize: 18 }}>⋮</Text> {/* Vertical dots */}
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
            <Text
              style={{
                fontSize: 14,
                color: "#333",
                marginBottom: 10,
              }}
            >
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
            Comments Section
          </Text>
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

      {/* Popup for Three Dots */}
      <Modal
        visible={popupVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}
      >
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text>Popup content for three dots</Text>
            <TouchableOpacity
              onPress={() => setPopupVisible(false)}
              style={{ marginTop: 20, padding: 10 }}
            >
              <Text style={{ color: "#007BFF" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default App;
