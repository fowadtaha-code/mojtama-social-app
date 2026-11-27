import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FriendUser {
  id: string;
  name: string;
  handle: string;
  bio: string;
  isFriend: boolean;
}

interface FriendsScreenProps {
  onClose?: () => void;
  onStartChat?: (user: FriendUser) => void;
}

const INITIAL_USERS: FriendUser[] = [
  {
    id: '1',
    name: 'أحمد العتيبي',
    handle: '@ahmed_otb',
    bio: 'مهتم بالتقنية وتطوير التطبيقات والقهوة المختصة',
    isFriend: true,
  },
  {
    id: '2',
    name: 'سارة المنصور',
    handle: '@sara_m',
    bio: 'مصممة واجهات ومحتوى إبداعي',
    isFriend: true,
  },
  {
    id: '3',
    name: 'خالد الحربي',
    handle: '@khaled_hrb',
    bio: 'مصور فوتوغرافي ورحالة في السعودية',
    isFriend: false,
  },
  {
    id: '4',
    name: 'نورة القحطاني',
    handle: '@noura_q',
    bio: 'كاتبة وقارئة شغوفة بالتاريخ والروايات',
    isFriend: false,
  },
  {
    id: '5',
    name: 'فهد الدوسري',
    handle: '@fahad_dsr',
    bio: 'مطور ويب ومحب للألعاب الجماعية',
    isFriend: false,
  },
];

const FriendsScreen: React.FC<FriendsScreenProps> = ({ onClose, onStartChat }) => {
  const [users, setUsers] = useState<FriendUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'discover'>('all');

  const toggleFriendStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === userId ? { ...item, isFriend: !item.isFriend } : item
      )
    );
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      const matchesTab =
        activeTab === 'all'
          ? true
          : activeTab === 'friends'
          ? user.isFriend
          : !user.isFriend;

      if (!matchesTab) return false;
      if (!q) return true;

      return (
        user.name.toLowerCase().includes(q) ||
        user.handle.toLowerCase().includes(q) ||
        user.bio.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الصداقات والبحث</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={22} color="#111827" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث بالاسم أو المعرف أو الاهتمامات..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'all' && styles.activeTabBtn]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            الكل ({users.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'friends' && styles.activeTabBtn]}
          onPress={() => setActiveTab('friends')}
        >
          <Text
            style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}
          >
            أصدقائي ({users.filter((u) => u.isFriend).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'discover' && styles.activeTabBtn]}
          onPress={() => setActiveTab('discover')}
        >
          <Text
            style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}
          >
            اكتشف ({users.filter((u) => !u.isFriend).length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyText}>لا توجد نتائج مطابقة لبحثك</Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userHandle}>{user.handle}</Text>
                <Text style={styles.userBio} numberOfLines={2}>
                  {user.bio}
                </Text>
              </View>

              <View style={styles.actionsCol}>
                <TouchableOpacity
                  style={[
                    styles.friendBtn,
                    user.isFriend ? styles.removeFriendBtn : styles.addFriendBtn,
                  ]}
                  onPress={() => toggleFriendStatus(user.id)}
                >
                  <Ionicons
                    name={user.isFriend ? 'checkmark' : 'person-add'}
                    size={15}
                    color={user.isFriend ? '#111827' : '#FFFFFF'}
                  />
                  <Text
                    style={[
                      styles.friendBtnText,
                      user.isFriend ? styles.removeFriendText : styles.addFriendText,
                    ]}
                  >
                    {user.isFriend ? 'صديق' : 'إضافة'}
                  </Text>
                </TouchableOpacity>

                {onStartChat && (
                  <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() => onStartChat(user)}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#2563EB" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    textAlign: 'right',
    paddingVertical: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  activeTabBtn: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  userHandle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 1,
  },
  userBio: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'right',
    marginTop: 4,
  },
  actionsCol: {
    alignItems: 'center',
    gap: 6,
  },
  friendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    gap: 4,
  },
  addFriendBtn: {
    backgroundColor: '#2563EB',
  },
  removeFriendBtn: {
    backgroundColor: '#E5E7EB',
  },
  friendBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addFriendText: {
    color: '#FFFFFF',
  },
  removeFriendText: {
    color: '#111827',
  },
  chatBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default FriendsScreen;
