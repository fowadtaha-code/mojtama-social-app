import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addToAddedList,
  cancelAddedUser,
  confirmFriendRequest,
  FriendsState,
  INITIAL_USERS,
  loadFriendsState,
  removeFriendUser,
  saveFriendsState,
  searchUsers,
  User,
} from "../friendsService";

type TabType = "discover" | "added" | "friends";

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("discover");
  const [friendsState, setFriendsState] = useState<FriendsState>({
    addedIds: [],
    friendsIds: [],
  });

  useEffect(() => {
    loadFriendsState().then(setFriendsState);
  }, []);

  const updateState = async (next: FriendsState) => {
    setFriendsState(next);
    await saveFriendsState(next);
  };

  const filteredUsers = useMemo(() => {
    const searched = searchUsers(INITIAL_USERS, searchQuery);
    if (activeTab === "added") {
      return searched.filter((u) => friendsState.addedIds.includes(u.id));
    }
    if (activeTab === "friends") {
      return searched.filter((u) => friendsState.friendsIds.includes(u.id));
    }
    return searched;
  }, [searchQuery, activeTab, friendsState]);

  const renderUserItem = ({ item }: { item: User }) => {
    const isFriend = friendsState.friendsIds.includes(item.id);
    const isAdded = friendsState.addedIds.includes(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.username}>{item.username}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {isFriend ? (
            <>
              <View style={[styles.badge, styles.friendBadge]}>
                <Text style={styles.friendBadgeText}>صديق ✓</Text>
              </View>
              <TouchableOpacity
                style={[styles.btn, styles.removeBtn]}
                onPress={() => updateState(removeFriendUser(friendsState, item.id))}
              >
                <Text style={styles.removeBtnText}>إزالة</Text>
              </TouchableOpacity>
            </>
          ) : isAdded ? (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.primaryBtn]}
                onPress={() => updateState(confirmFriendRequest(friendsState, item.id))}
              >
                <Text style={styles.primaryBtnText}>تأكيد</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.removeBtn]}
                onPress={() => updateState(cancelAddedUser(friendsState, item.id))}
              >
                <Text style={styles.removeBtnText}>إلغاء</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.btn, styles.primaryBtn]}
              onPress={() => updateState(addToAddedList(friendsState, item.id))}
            >
              <Text style={styles.primaryBtnText}>+ إضافة</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>الأصدقاء والبحث</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="ابحث بالاسم أو @username..."
        placeholderTextColor="#94a3b8"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "discover" && styles.activeTab]}
          onPress={() => setActiveTab("discover")}
        >
          <Text style={[styles.tabText, activeTab === "discover" && styles.activeTabText]}>
            بحث / الكل
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "added" && styles.activeTab]}
          onPress={() => setActiveTab("added")}
        >
          <Text style={[styles.tabText, activeTab === "added" && styles.activeTabText]}>
            الإضافات ({friendsState.addedIds.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "friends" && styles.activeTab]}
          onPress={() => setActiveTab("friends")}
        >
          <Text style={[styles.tabText, activeTab === "friends" && styles.activeTabText]}>
            الأصدقاء ({friendsState.friendsIds.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderUserItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>لا توجد نتائج مطابقة في هذا القسم.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a", marginBottom: 12, textAlign: "right" },
  searchInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a",
    marginBottom: 12,
    textAlign: "right",
  },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 14 },
  tab: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeTab: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#334155" },
  activeTabText: { color: "#ffffff" },
  list: { gap: 10, paddingBottom: 24 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#2563eb", fontWeight: "700", fontSize: 18 },
  name: { fontSize: 16, fontWeight: "700", color: "#0f172a", textAlign: "right" },
  username: { fontSize: 13, color: "#64748b", textAlign: "right" },
  actions: { flexDirection: "row", gap: 8, justifyContent: "flex-end" },
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  primaryBtn: { backgroundColor: "#2563eb" },
  primaryBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
  removeBtn: { backgroundColor: "#fee2e2" },
  removeBtnText: { color: "#dc2626", fontWeight: "600", fontSize: 13 },
  badge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  friendBadge: { backgroundColor: "#dcfce7" },
  friendBadgeText: { color: "#16a34a", fontWeight: "700", fontSize: 13 },
  emptyText: { textAlign: "center", color: "#64748b", marginTop: 32, fontSize: 15 },
});
