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
import * as ImagePicker from "expo-image-picker"; // Untuk memilih gambar dari perangkat

// Pastikan Anda memiliki file icons.js dan images.js yang sesuai
import icons from "../../constants/icons";
import images from "../../constants/images";

const Community = () => {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Untuk menyimpan postingan yang dipilih
  const [posts, setPosts] = useState([
    {
      id: "1",
      name: "Nikita",
      profilePicture: "https://via.placeholder.com/100",
      postImage: "https://via.placeholder.com/300",
      caption: "This is a sample caption.",
      fullCaption:
        "This is a sample caption. Tap 'see more' to expand. Here is the full caption that gets displayed when expanded.",
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
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [currentUser, setCurrentUser] = useState({
    name: "Nikita", // Nama pengguna yang sedang login
    profilePicture: "https://via.placeholder.com/100", // Foto profil pengguna
  });

  // Fungsi untuk memperluas/menyembunyikan caption
  const toggleCaption = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, isCaptionExpanded: !post.isCaptionExpanded }
          : post
      )
    );
  };

  // Fungsi untuk menangani pencarian
  const handleSearchPress = () => {
    setIsSearching(true);
  };

  // Fungsi untuk membatalkan pencarian
  const handleCancelSearch = () => {
    setSearchText("");
    setIsSearching(false);
  };

  // Fungsi untuk menyukai postingan
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

  // Fungsi untuk menampilkan modal komentar
  const handleComment = () => {
    setCommentModalVisible(true);
  };

  // Fungsi untuk menampilkan modal share
  const handleShare = () => {
    setShareModalVisible(true);
  };

  // Fungsi untuk menampilkan popup menu
  const handleThreeDots = (post) => {
    setSelectedPost(post); // Simpan postingan yang dipilih
    setPopupVisible(true); // Tampilkan popup menu
  };

  // Fungsi untuk menampilkan layar posting baru
  const handlePlusButtonPress = () => {
    setIsNewPostScreenVisible(true);
  };

  // Fungsi untuk menutup layar posting baru
  const handleCloseNewPostScreen = () => {
    if (postText.trim() || newPostImage) {
      setIsLeaveModalVisible(true); // Tampilkan modal konfirmasi
    } else {
      setIsNewPostScreenVisible(false); // Langsung tutup jika tidak ada perubahan
    }
  };

  // Fungsi untuk meninggalkan layar posting baru tanpa menyimpan
  const handleLeaveWithoutSaving = () => {
    setIsNewPostScreenVisible(false);
    setPostText("");
    setNewPostImage(null);
    setIsLeaveModalVisible(false);
  };

  // Fungsi untuk membatalkan meninggalkan layar posting baru
  const handleCancelLeave = () => {
    setIsLeaveModalVisible(false);
  };

  // Fungsi untuk memposting konten baru
  const handlePost = () => {
    if (postText.trim() || newPostImage) {
      const newPost = {
        id: Date.now().toString(),
        name: currentUser.name, // Gunakan nama pengguna yang sedang login
        profilePicture: currentUser.profilePicture, // Gunakan foto profil pengguna
        postImage: newPostImage || "https://via.placeholder.com/300", // Gunakan gambar yang dipilih atau placeholder
        caption: postText, // Caption yang dimasukkan
        fullCaption: postText, // Caption lengkap (sama dengan caption)
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), // Waktu posting
        isCaptionExpanded: false, // Caption belum diperluas
        isLiked: false, // Postingan belum disukai
        likes: 0, // Jumlah likes awal
        comments: 0, // Jumlah komentar awal
      };

      // Tambahkan postingan baru ke daftar postingan
      setPosts([newPost, ...posts]);

      // Reset state setelah posting
      setPostText("");
      setNewPostImage(null);
      setIsNewPostScreenVisible(false); // Tutup modal posting baru
    }
  };

  // Fungsi untuk menambahkan gambar dari perangkat
  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPostImage(result.uri); // Set URI gambar yang dipilih
    }
  };

  // Fungsi untuk menyembunyikan semua postingan dari pengguna tertentu
  const hideAllUpdatesFrom = (name) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.name !== name));
    setPopupVisible(false); // Tutup popup setelah menyembunyikan postingan
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
              source={icons.search}
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
                    <Image
                      source={icons.three_dots}
                      style={{ width: 20, height: 20, resizeMode: "contain" }}
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
                onPress={() => {
                  // Handle share on Facebook
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
                  // Handle share on WhatsApp
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
                  // Handle copy link
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
              {/* Button to remove image */}
              <TouchableOpacity
                onPress={() => setNewPostImage(null)} // Hapus gambar yang dipilih
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  borderRadius: 15,
                  padding: 5,
                }}
              >
                <Image
                  source={icons.close} // Pastikan Anda memiliki ikon close di file icons.js
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: "#fff",
                  }}
                />
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
  );
};

export default Community;