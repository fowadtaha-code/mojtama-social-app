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
  status: 'friend' | 'pending_incoming' | 'none';
}

const INITIAL_USERS: FriendUser[] = [
  {
    id: '1',
    name: 'أحمد العتيبي',
    handle: '@ahmed_otb',
    bio: 'مهتم بالتقنية وتطوير التطبيقات والقهوة المختصة',
    status: 'friend',
  },
  {
    id: '2',
    name: 'سارة المنصور',
    handle: '@sara_m',
    bio: 'مصممة واجهات ومحتوى إبداعي',
    status: 'friend',
  },
  {
    id: '3',
    name: 'خالد الحربي',
    handle: '@khaled_hrb',
    bio: 'مصور فوتوغرافي ورحالة في السعودية',
    status: 'pending_incoming',
  },
  {
    id: '4',
    name: 'نورة القحطاني',
    handle: '@noura_q',
    bio: 'كاتبة وقارئة شغوفة بالتاريخ والروايات',
    status: 'pending_incoming',
  },
  {
    id: '5',
    name: 'فهد الدوسري',
    handle: '@fahad_dsr',
    bio: 'مطور ويب ومحب للألعاب الجماعية',
    status: 'none',
  },
  {
    id: '6',
    name: 'ريم الشمري',
    handle: '@reem_sh',
    bio: 'مهتمة بالبرمجة والتصوير وريادة الأعمال',
    status: 'none',
  },
];

type SectionTab = 'friends' | 'requests' | 'search';

const AforaHomeScreen: React.FC = () => {
  const [users, setUsers] = useState<FriendUser[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<SectionTab>('friends');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const friendsList = useMemo(
    () => users.filter((u) => u.status === 'friend'),
    [users]
  );

  const incomingRequests = useMemo(
    () => users.filter((u) => u.status === 'pending_incoming'),
    [users]
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.handle.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const acceptRequest = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'friend' } : u))
    );
  };

  const rejectRequest = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'none' } : u))
    );
  };

  const removeFriend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'none' } : u))
    );
  };

  const toggleAddFriend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        if (u.status === 'friend') return { ...u, status: 'none' };
        return { ...u, status: 'friend' };
      })
    );
  };

  const renderUserCard = (user: FriendUser, mode: SectionTab) => {
    return (
      <View key={user.id} style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userHandle}>{user.handle}</Text>
          <Text style={styles.userBio} numberOfLines={2}>
            {user.bio}
          </Text>
        </View>

        <View style={styles.actionsBox}>
          {mode === 'requests' && (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.acceptBtn]}
                onPress={() => acceptRequest(user.id)}
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                <Text style={styles.acceptBtnText}>قبول</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.rejectBtn]}
                onPress={() => rejectRequest(user.id)}
              >
                <Ionicons name="close" size={16} color="#991B1B" />
                <Text style={styles.rejectBtnText}>رفض</Text>
              </TouchableOpacity>
            </>
          )}

          {mode === 'friends' && (
            <TouchableOpacity
              style={[styles.btn, styles.secondaryBtn]}
              onPress={() => removeFriend(user.id)}
            >
              <Ionicons name="person-remove-outline" size={15} color="#374151" />
              <Text style={styles.secondaryBtnText}>إزالة</Text>
            </TouchableOpacity>
          )}

          {mode === 'search' && (
            <>
              {user.status === 'pending_incoming' ? (
                <TouchableOpacity
                  style={[styles.btn, styles.acceptBtn]}
                  onPress={() => acceptRequest(user.id)}
                >
                  <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                  <Text style={styles.acceptBtnText}>قبول الطلب</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.btn,
                    user.status === 'friend' ? styles.secondaryBtn : styles.primaryBtn,
                  ]}
                  onPress={() => toggleAddFriend(user.id)}
                >
                  <Ionicons
                    name={user.status === 'friend' ? 'checkmark-circle' : 'person-add'}
                    size={15}
                    color={user.status === 'friend' ? '#111827' : '#FFFFFF'}
                  />
                  <Text
                    style={
                      user.status === 'friend'
                        ? styles.secondaryBtnText
                        : styles.primaryBtnText
                    }
                  >
                    {user.status === 'friend' ? 'صديق' : 'إضافة'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>AFORA</Text>
          <Text style={styles.subTitle}>الشاشة الرئيسية • الأصدقاء والطلبات والبحث</Text>
        </View>
        <View style={styles.badgeSummary}>
          <Ionicons name="people" size={18} color="#2563EB" />
          <Text style={styles.badgeText}>{friendsList.length}</Text>
        </View>
      </View>

      <View style={styles.tabsBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'friends' && styles.activeTabItem]}
          onPress={() => setActiveTab('friends')}
        >
          <Ionicons
            name="people-outline"
            size={16}
            color={activeTab === 'friends' ? '#FFFFFF' : '#374151'}
          />
          <Text style={[styles.tabLabel, activeTab === 'friends' && styles.activeTabLabel]}>
            الأصدقاء ({friendsList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'requests' && styles.activeTabItem]}
          onPress={() => setActiveTab('requests')}
        >
          <Ionicons
            name="person-add-outline"
            size={16}
            color={activeTab === 'requests' ? '#FFFFFF' : '#374151'}
          />
          <Text style={[styles.tabLabel, activeTab === 'requests' && styles.activeTabLabel]}>
            الطلبات ({incomingRequests.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'search' && styles.activeTabItem]}
          onPress={() => setActiveTab('search')}
        >
          <Ionicons
            name="search-outline"
            size={16}
            color={activeTab === 'search' ? '#FFFFFF' : '#374151'}
          />
          <Text style={[styles.tabLabel, activeTab === 'search' && styles.activeTabLabel]}>
            بحث
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'search' && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن صديق بالاسم أو @المعرف أو الاهتمام..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'friends' && (
          <>
            <Text style={styles.sectionHeading}>قائمة الأصدقاء</Text>
            {friendsList.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={42} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>لا يوجد أصدقاء حالياً</Text>
                <Text style={styles.emptyDesc}>
                  انتقل إلى تبويب البحث لإضافة أصدقاء أو اقبل طلبات الصداقة الواردة.
                </Text>
              </View>
            ) : (
              friendsList.map((user) => renderUserCard(user, 'friends'))
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            <Text style={styles.sectionHeading}>طلبات الصداقة الواردة</Text>
            {incomingRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="mail-open-outline" size={42} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>لا توجد طلبات صداقة معلقة</Text>
                <Text style={styles.emptyDesc}>
                  ستظهر هنا أي طلبات صداقة جديدة يرسلها الآخرون إليك.
                </Text>
              </View>
            ) : (
              incomingRequests.map((user) => renderUserCard(user, 'requests'))
            )}
          </>
        )}

        {activeTab === 'search' && (
          <>
            <Text style={styles.sectionHeading}>نتائج البحث عن الأصدقاء</Text>
            {searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={42} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>لا توجد نتائج مطابقة</Text>
                <Text style={styles.emptyDesc}>
                  جرّب البحث باسم آخر أو معرف مختلف.
                </Text>
              </View>
            ) : (
              searchResults.map((user) => renderUserCard(user, 'search'))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'left',
  },
  subTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'left',
  },
  badgeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  tabsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    gap: 5,
  },
  activeTabItem: {
    backgroundColor: '#111827',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    textAlign: 'right',
    paddingVertical: 2,
  },
  scrollContent: {
    padding: 14,
    gap: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
  },
  cardInfo: {
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
  actionsBox: {
    alignItems: 'flex-end',
    gap: 6,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    gap: 4,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  acceptBtn: {
    backgroundColor: '#16A34A',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rejectBtn: {
    backgroundColor: '#FEE2E2',
  },
  rejectBtnText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#E5E7EB',
  },
  secondaryBtnText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    marginTop: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default AforaHomeScreen;
