import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export interface FriendItem {
  id: string;
  name: string;
  handle: string;
  bio: string;
  status: 'friend' | 'pending_incoming' | 'none';
}

interface StoryItem {
  id: string;
  name: string;
  ringColor: string;
}

interface PostItem {
  id: string;
  author: string;
  handle: string;
  timeAgo: string;
  type: 'posts' | 'photos' | 'videos';
  content: string;
  mediaUri?: string;
  isFriendUpload?: boolean;
  downloaded?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

const INITIAL_FRIENDS_DATA: FriendItem[] = [
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

const STORIES: StoryItem[] = [
  { id: 's1', name: 'ليلى', ringColor: '#22C55E' },
  { id: 's2', name: 'محمد', ringColor: '#EC4899' },
  { id: 's3', name: 'سارة', ringColor: '#8B5CF6' },
  { id: 's4', name: 'أحمد', ringColor: '#38BDF8' },
];

const POSTS: PostItem[] = [
  {
    id: 'p1',
    author: 'أحمد الشمري',
    handle: '@ahmed_sh',
    timeAgo: 'منذ 2 س',
    type: 'photos',
    content: 'أحياناً .. كل ما نحتاجه هو لحظة هدوء وموسيقى جميلة 💜',
    mediaUri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
    isFriendUpload: true,
    downloaded: false,
  },
  {
    id: 'p2',
    author: 'سارة المنصور',
    handle: '@sara_m',
    timeAgo: 'منذ 4 س',
    type: 'posts',
    content: 'نعمل على تحسين تجربة الاستخدام في WEXO لتكون أسرع وأوضح للجميع.',
    isFriendUpload: true,
  },
  {
    id: 'p3',
    author: 'خالد الحربي',
    handle: '@khaled_hrb',
    timeAgo: 'منذ 6 س',
    type: 'videos',
    content: 'لقطات سريعة من جولة مسائية على الساحل.',
    mediaUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    isFriendUpload: true,
    downloaded: true,
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', sender: 'them', text: 'هلا بك! كيف أمور تطبيق WEXO؟', time: '05:10 ص' },
    { id: 'm2', sender: 'me', text: 'أهلاً أحمد، شغالين على تطوير المزايا خطوة بخطوة.', time: '05:12 ص' },
  ],
  '2': [
    { id: 'm3', sender: 'them', text: 'أهلاً، شكل الواجهة الداكنة طالع مرتب جداً.', time: '04:45 ص' },
  ],
};

type MediaFilter = 'all' | 'photos' | 'videos' | 'posts' | 'downloaded';
type BottomTab = 'home' | 'search' | 'friends' | 'chats' | 'profile';
type FriendsSubTab = 'friends' | 'requests';
type CallType = 'voice' | 'video' | null;

const WexoHomeScreen: React.FC = () => {
  const [users, setUsers] = useState<FriendItem[]>(INITIAL_FRIENDS_DATA);
  const [activeFilter, setActiveFilter] = useState<MediaFilter>('all');
  const [bottomTab, setBottomTab] = useState<BottomTab>('home');
  const [friendsSubTab, setFriendsSubTab] = useState<FriendsSubTab>('friends');
  const [postDraft, setPostDraft] = useState<string>('');
  const [selectedMediaUri, setSelectedMediaUri] = useState<string | undefined>(undefined);
  const [selectedMediaType, setSelectedMediaType] = useState<'photos' | 'videos'>('photos');
  const [postsList, setPostsList] = useState<PostItem[]>(POSTS);
  const [friendSearchQuery, setFriendSearchQuery] = useState<string>('');
  const [previewPost, setPreviewPost] = useState<PostItem | null>(null);

  const [activeChatFriend, setActiveChatFriend] = useState<FriendItem | null>(null);
  const [messagesByFriend, setMessagesByFriend] =
    useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState<string>('');
  const [callType, setCallType] = useState<CallType>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);

  const friendsList = useMemo(
    () => users.filter((u) => u.status === 'friend'),
    [users]
  );

  const incomingRequests = useMemo(
    () => users.filter((u) => u.status === 'pending_incoming'),
    [users]
  );

  const friendNamesSet = useMemo(
    () => new Set(friendsList.map((f) => f.name)),
    [friendsList]
  );

  const friendMediaItems = useMemo(
    () =>
      postsList.filter(
        (p) =>
          (p.type === 'photos' || p.type === 'videos') &&
          (p.isFriendUpload || friendNamesSet.has(p.author))
      ),
    [postsList, friendNamesSet]
  );

  const downloadedMediaItems = useMemo(
    () =>
      postsList.filter(
        (p) => (p.type === 'photos' || p.type === 'videos') && p.downloaded
      ),
    [postsList]
  );

  const filteredFriendsSearch = useMemo(() => {
    const q = friendSearchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.handle.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
    );
  }, [users, friendSearchQuery]);

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return postsList;
    if (activeFilter === 'downloaded') return downloadedMediaItems;
    return postsList.filter((p) => p.type === activeFilter);
  }, [postsList, activeFilter, downloadedMediaItems]);

  const pickMedia = async (kind: 'photos' | 'videos') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('تنبيه', 'يرجى السماح بالوصول إلى الصور والفيديوهات لاختيار ملف.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          kind === 'videos'
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedMediaUri(result.assets[0].uri);
        setSelectedMediaType(kind);
      }
    } catch {
      Alert.alert('تعذر الفتح', 'تعذر فتح منتقي الوسائط في هذه البيئة.');
    }
  };

  const handleDownloadMedia = (postId: string) => {
    setPostsList((prev) =>
      prev.map((item) =>
        item.id === postId ? { ...item, downloaded: true } : item
      )
    );
    Alert.alert('تم التحميل', 'تم حفظ العنصر ضمن قسم ما تم تحميله.');
  };

  const acceptFriendRequest = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'friend' } : u))
    );
  };

  const rejectFriendRequest = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'none' } : u))
    );
  };

  const removeFriend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'none' } : u))
    );
    if (activeChatFriend?.id === id) {
      setActiveChatFriend(null);
    }
  };

  const toggleFriendConnection = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        if (u.status === 'pending_incoming') return { ...u, status: 'friend' };
        if (u.status === 'friend') return { ...u, status: 'none' };
        return { ...u, status: 'friend' };
      })
    );
  };

  const handleQuickPublish = () => {
    const text = postDraft.trim();
    if (!text && !selectedMediaUri) return;

    const newPost: PostItem = {
      id: String(Date.now()),
      author: 'أنت',
      handle: '@wexo_user',
      timeAgo: 'الآن',
      type: selectedMediaUri ? selectedMediaType : 'posts',
      content:
        text ||
        (selectedMediaType === 'videos'
          ? 'مقطع فيديو جديد تم رفعه'
          : 'صورة جديدة تم رفعها'),
      mediaUri: selectedMediaUri,
      isFriendUpload: false,
      downloaded: false,
    };

    setPostsList((prev) => [newPost, ...prev]);
    setPostDraft('');
    setSelectedMediaUri(undefined);
    setBottomTab('home');
  };

  const openDirectChat = (friend: FriendItem) => {
    setActiveChatFriend(friend);
    setBottomTab('chats');
  };

  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text || !activeChatFriend) return;

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'me',
      text,
      time: 'الآن',
    };

    setMessagesByFriend((prev) => ({
      ...prev,
      [activeChatFriend.id]: [...(prev[activeChatFriend.id] || []), newMsg],
    }));
    setChatInput('');
  };

  const startCall = (type: 'voice' | 'video') => {
    setIsMuted(false);
    setIsSpeaker(type === 'video');
    setCallType(type);
  };

  const endCall = () => {
    setCallType(null);
  };

  const renderUserRow = (person: FriendItem, mode: 'search' | FriendsSubTab) => (
    <View key={person.id} style={styles.userRowCard}>
      <View style={styles.userRowAvatar}>
        <Text style={styles.userRowAvatarText}>{person.name.slice(0, 1)}</Text>
      </View>

      <View style={styles.userRowMeta}>
        <Text style={styles.userRowName}>{person.name}</Text>
        <Text style={styles.userRowHandle}>{person.handle}</Text>
        <Text style={styles.userRowBio} numberOfLines={1}>
          {person.bio}
        </Text>
      </View>

      {mode === 'requests' && (
        <View style={styles.reqButtonsRow}>
          <TouchableOpacity
            style={styles.acceptPillBtn}
            onPress={() => acceptFriendRequest(person.id)}
          >
            <Text style={styles.actionBtnText}>قبول</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectPillBtn}
            onPress={() => rejectFriendRequest(person.id)}
          >
            <Text style={styles.actionBtnText}>رفض</Text>
          </TouchableOpacity>
        </View>
      )}

      {mode === 'friends' && (
        <TouchableOpacity
          style={styles.removePillBtn}
          onPress={() => removeFriend(person.id)}
        >
          <Text style={styles.actionBtnText}>إزالة</Text>
        </TouchableOpacity>
      )}

      {mode === 'search' && (
        <>
          {person.status === 'pending_incoming' ? (
            <TouchableOpacity
              style={styles.acceptPillBtn}
              onPress={() => acceptFriendRequest(person.id)}
            >
              <Text style={styles.actionBtnText}>قبول</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.connectPillBtn,
                person.status === 'friend' && styles.friendActivePillBtn,
              ]}
              onPress={() => toggleFriendConnection(person.id)}
            >
              <Text style={styles.actionBtnText}>
                {person.status === 'friend' ? 'صديق' : 'إضافة'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  const activeMessages = activeChatFriend
    ? messagesByFriend[activeChatFriend.id] || []
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0914" />

      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.iconActionBtn}
          onPress={() => {
            setActiveChatFriend(null);
            setFriendsSubTab('requests');
            setBottomTab('friends');
          }}
        >
          <Ionicons name="notifications-outline" size={22} color="#F3F4F6" />
          {incomingRequests.length > 0 && (
            <View style={styles.redBadge}>
              <Text style={styles.redBadgeText}>{incomingRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.brandCenter}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeLetter}>W</Text>
          </View>
          <Text style={styles.brandTitle}>WEXO</Text>
        </View>

        <TouchableOpacity
          style={styles.profileChip}
          onPress={() => {
            setActiveChatFriend(null);
            setBottomTab('profile');
          }}
        >
          <View style={styles.profileMiniAvatar}>
            <Text style={styles.profileMiniText}>م</Text>
          </View>
          <Ionicons name="chevron-down" size={16} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      {bottomTab === 'home' && (
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesRow}
          >
            {STORIES.map((story) => (
              <View key={story.id} style={styles.storyItem}>
                <View style={[styles.storyRing, { borderColor: story.ringColor }]}>
                  <View style={styles.storyInner}>
                    <Text style={styles.storyLetter}>{story.name.slice(0, 1)}</Text>
                  </View>
                </View>
                <Text style={styles.storyName}>{story.name}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.composerCard}>
            <View style={styles.composerTop}>
              <View style={styles.composerAvatar}>
                <Text style={styles.composerAvatarText}>م</Text>
              </View>
              <TextInput
                style={styles.composerInput}
                placeholder="بم تفكر الآن؟ انشر شيئاً..."
                placeholderTextColor="#9CA3AF"
                value={postDraft}
                onChangeText={setPostDraft}
              />
            </View>

            {selectedMediaUri && (
              <View style={styles.pickedMediaRow}>
                <Text style={styles.pickedMediaText}>
                  {selectedMediaType === 'videos'
                    ? 'تم اختيار فيديو للإرفاق'
                    : 'تم اختيار صورة للإرفاق'}
                </Text>
                <TouchableOpacity onPress={() => setSelectedMediaUri(undefined)}>
                  <Ionicons name="close-circle" size={18} color="#F87171" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.composerActions}>
              <TouchableOpacity
                onPress={() => pickMedia('photos')}
                style={styles.composerIconBtn}
              >
                <Ionicons name="image-outline" size={20} color="#A78BFA" />
                <Text style={styles.composerBtnLabel}>صورة</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickMedia('videos')}
                style={styles.composerIconBtn}
              >
                <Ionicons name="videocam-outline" size={20} color="#C084FC" />
                <Text style={styles.composerBtnLabel}>فيديو</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleQuickPublish}
                style={styles.publishPillBtn}
              >
                <Ionicons name="send" size={14} color="#FFFFFF" />
                <Text style={styles.publishPillText}>نشر</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            {(
              [
                { key: 'all', label: 'الكل' },
                { key: 'photos', label: 'الصور' },
                { key: 'videos', label: 'الفيديوهات' },
                { key: 'posts', label: 'المنشورات' },
                { key: 'downloaded', label: `المحملات (${downloadedMediaItems.length})` },
              ] as { key: MediaFilter; label: string }[]
            ).map((f) => {
              const selected = activeFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterChip, selected && styles.filterChipActive]}
                  onPress={() => setActiveFilter(f.key)}
                >
                  <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* قسم صور وفيديوهات الأصدقاء ومشاهدتها وتحميلها */}
          <View style={styles.friendsMediaSection}>
            <View style={styles.friendsMediaHeader}>
              <Text style={styles.sectionTitle}>
                صور وفيديوهات الأصدقاء ({friendMediaItems.length})
              </Text>
              <TouchableOpacity onPress={() => setActiveFilter('downloaded')}>
                <Text style={styles.linkActionText}>
                  ما تم تحميله ({downloadedMediaItems.length})
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.friendsMediaRow}
            >
              {friendMediaItems.map((item) => (
                <View key={`fm-${item.id}`} style={styles.friendMediaCard}>
                  <TouchableOpacity
                    style={styles.friendMediaThumbWrap}
                    onPress={() => setPreviewPost(item)}
                  >
                    {item.mediaUri ? (
                      <Image
                        source={{ uri: item.mediaUri }}
                        style={styles.friendMediaThumb}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.friendMediaPlaceholder}>
                        <Ionicons
                          name={item.type === 'videos' ? 'videocam' : 'image'}
                          size={24}
                          color="#C084FC"
                        />
                      </View>
                    )}
                    <View style={styles.mediaTypeTag}>
                      <Text style={styles.mediaTypeTagText}>
                        {item.type === 'videos' ? 'فيديو' : 'صورة'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <Text style={styles.friendMediaAuthor} numberOfLines={1}>
                    {item.author}
                  </Text>

                  <View style={styles.friendMediaBtnsRow}>
                    <TouchableOpacity
                      style={styles.watchSmallBtn}
                      onPress={() => setPreviewPost(item)}
                    >
                      <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.smallActionLabel}>مشاهدة</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.downloadSmallBtn,
                        item.downloaded && styles.downloadedDoneBtn,
                      ]}
                      onPress={() => handleDownloadMedia(item.id)}
                    >
                      <Ionicons
                        name={item.downloaded ? 'checkmark-done' : 'download-outline'}
                        size={14}
                        color="#FFFFFF"
                      />
                      <Text style={styles.smallActionLabel}>
                        {item.downloaded ? 'محمّل' : 'تحميل'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {filteredPosts.length === 0 ? (
            <Text style={styles.emptyText}>
              لا توجد عناصر مطابقة لهذا التصفية حالياً.
            </Text>
          ) : (
            filteredPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postAuthorLeft}>
                    <View style={styles.postAvatar}>
                      <Text style={styles.postAvatarText}>{post.author.slice(0, 1)}</Text>
                    </View>
                    <View>
                      <View style={styles.authorNameRow}>
                        <Text style={styles.postAuthorName}>{post.author}</Text>
                        <Ionicons name="checkmark-circle" size={15} color="#38BDF8" />
                      </View>
                      <Text style={styles.postTime}>{post.timeAgo}</Text>
                    </View>
                  </View>
                  <Ionicons name="ellipsis-horizontal" size={18} color="#9CA3AF" />
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                {(post.type === 'photos' || post.type === 'videos') && (
                  <View style={styles.mediaCardBox}>
                    {post.mediaUri ? (
                      <Image
                        source={{ uri: post.mediaUri }}
                        style={styles.postImagePreview}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.mediaBanner}>
                        <Ionicons
                          name={post.type === 'videos' ? 'play-circle-outline' : 'image-outline'}
                          size={28}
                          color="#C084FC"
                        />
                        <Text style={styles.mediaBannerText}>
                          {post.type === 'videos' ? 'مقطع فيديو مرفق' : 'صورة مرفقة بالمنشور'}
                        </Text>
                      </View>
                    )}

                    <View style={styles.postMediaActions}>
                      <TouchableOpacity
                        style={styles.postActionBtn}
                        onPress={() => setPreviewPost(post)}
                      >
                        <Ionicons name="eye-outline" size={16} color="#E9D5FF" />
                        <Text style={styles.postActionBtnText}>مشاهدة</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.postActionBtn,
                          post.downloaded && styles.postActionDone,
                        ]}
                        onPress={() => handleDownloadMedia(post.id)}
                      >
                        <Ionicons
                          name={post.downloaded ? 'checkmark-done' : 'download-outline'}
                          size={16}
                          color="#E9D5FF"
                        />
                        <Text style={styles.postActionBtnText}>
                          {post.downloaded ? 'تم التحميل' : 'تحميل'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* نافذة مشاهدة الصورة أو الفيديو ومشاركتها/تحميلها */}
      <Modal
        visible={previewPost !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPreviewPost(null)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                {previewPost?.author} • {previewPost?.type === 'videos' ? 'فيديو' : 'صورة'}
              </Text>
              <TouchableOpacity onPress={() => setPreviewPost(null)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {previewPost?.mediaUri ? (
              <Image
                source={{ uri: previewPost.mediaUri }}
                style={styles.previewFullImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.previewEmptyBox}>
                <Ionicons name="film-outline" size={42} color="#C084FC" />
                <Text style={styles.mediaBannerText}>معاينة الوسائط</Text>
              </View>
            )}

            <Text style={styles.previewCaption}>{previewPost?.content}</Text>

            {previewPost && (
              <TouchableOpacity
                style={styles.modalDownloadBtn}
                onPress={() => handleDownloadMedia(previewPost.id)}
              >
                <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>
                  {previewPost.downloaded ? 'تم حفظه في المحملات' : 'تحميل الآن'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {bottomTab === 'search' && (
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>البحث عن الأصدقاء</Text>
            <View style={styles.searchInputRow}>
              <Ionicons name="search" size={18} color="#A78BFA" />
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث بالاسم أو @المعرف أو الاهتمام..."
                placeholderTextColor="#9CA3AF"
                value={friendSearchQuery}
                onChangeText={setFriendSearchQuery}
                autoCorrect={false}
              />
              {friendSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setFriendSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {filteredFriendsSearch.length === 0 ? (
              <Text style={styles.emptyText}>لا توجد نتائج مطابقة لبحثك.</Text>
            ) : (
              filteredFriendsSearch.map((person) => renderUserRow(person, 'search'))
            )}
          </View>
        </ScrollView>
      )}

      {bottomTab === 'friends' && (
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionBox}>
            <View style={styles.subTabsRow}>
              <TouchableOpacity
                style={[
                  styles.subTabBtn,
                  friendsSubTab === 'friends' && styles.subTabBtnActive,
                ]}
                onPress={() => setFriendsSubTab('friends')}
              >
                <Text style={styles.subTabText}>
                  قائمة الأصدقاء ({friendsList.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.subTabBtn,
                  friendsSubTab === 'requests' && styles.subTabBtnActive,
                ]}
                onPress={() => setFriendsSubTab('requests')}
              >
                <Text style={styles.subTabText}>
                  طلبات الصداقة ({incomingRequests.length})
                </Text>
              </TouchableOpacity>
            </View>

            {friendsSubTab === 'friends' ? (
              friendsList.length === 0 ? (
                <Text style={styles.emptyText}>
                  لا يوجد أصدقاء حالياً. استخدم تبويب بحث لإضافة أصدقاء.
                </Text>
              ) : (
                friendsList.map((friend) => renderUserRow(friend, 'friends'))
              )
            ) : incomingRequests.length === 0 ? (
              <Text style={styles.emptyText}>لا توجد طلبات صداقة واردة حالياً.</Text>
            ) : (
              incomingRequests.map((req) => renderUserRow(req, 'requests'))
            )}
          </View>
        </ScrollView>
      )}

      {bottomTab === 'chats' && !activeChatFriend && (
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>المحادثات</Text>
            {friendsList.length === 0 ? (
              <Text style={styles.emptyText}>
                أضف أصدقاء أولاً لبدء الدردشة أو إجراء المكالمات.
              </Text>
            ) : (
              friendsList.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={styles.userRowCard}
                  activeOpacity={0.8}
                  onPress={() => openDirectChat(friend)}
                >
                  <View style={styles.userRowAvatar}>
                    <Text style={styles.userRowAvatarText}>
                      {friend.name.slice(0, 1)}
                    </Text>
                  </View>
                  <View style={styles.userRowMeta}>
                    <Text style={styles.userRowName}>{friend.name}</Text>
                    <Text style={styles.userRowBio}>اضغط لبدء محادثة مباشرة</Text>
                  </View>
                  <View style={styles.chatQuickIcons}>
                    <TouchableOpacity
                      style={styles.miniCallBtn}
                      onPress={() => {
                        setActiveChatFriend(friend);
                        startCall('voice');
                      }}
                    >
                      <Ionicons name="call" size={16} color="#E9D5FF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.miniCallBtn}
                      onPress={() => {
                        setActiveChatFriend(friend);
                        startCall('video');
                      }}
                    >
                      <Ionicons name="videocam" size={16} color="#E9D5FF" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {bottomTab === 'chats' && activeChatFriend && (
        <View style={styles.chatRoomContainer}>
          <View style={styles.chatRoomHeader}>
            <View style={styles.chatRoomHeaderLeft}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setActiveChatFriend(null)}
              >
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.userRowAvatar}>
                <Text style={styles.userRowAvatarText}>
                  {activeChatFriend.name.slice(0, 1)}
                </Text>
              </View>
              <View>
                <Text style={styles.userRowName}>{activeChatFriend.name}</Text>
                <Text style={styles.onlineStatusText}>متصل الآن</Text>
              </View>
            </View>

            <View style={styles.callActionsRow}>
              <TouchableOpacity
                style={styles.voiceCallBtn}
                onPress={() => startCall('voice')}
              >
                <Ionicons name="call" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.videoCallBtn}
                onPress={() => startCall('video')}
              >
                <Ionicons name="videocam" size={19} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          >
            {activeMessages.length === 0 ? (
              <Text style={styles.emptyText}>
                ابدأ محادثتك مع {activeChatFriend.name} أو اضغط على أيقونة الاتصال أو الفيديو بالأعلى.
              </Text>
            ) : (
              activeMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    msg.sender === 'me'
                      ? styles.myMessageBubble
                      : styles.theirMessageBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.messageTime}>{msg.time}</Text>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.chatInputBar}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="اكتب رسالتك..."
              placeholderTextColor="#9CA3AF"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={styles.sendMsgBtn} onPress={sendChatMessage}>
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {bottomTab === 'profile' && (
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionBox}>
            <View style={styles.profileHeaderCard}>
              <View style={styles.profileBigAvatar}>
                <Text style={styles.profileBigAvatarText}>م</Text>
              </View>
              <Text style={styles.profileName}>حسابي في WEXO</Text>
              <Text style={styles.profileHandle}>@wexo_user</Text>
              <Text style={styles.profileStats}>
                الأصدقاء: {friendsList.length} • المحملات: {downloadedMediaItems.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={callType !== null}
        animationType="fade"
        transparent={false}
        onRequestClose={endCall}
      >
        <View style={styles.callScreen}>
          <View style={styles.callTopInfo}>
            <Text style={styles.callModeLabel}>
              {callType === 'video' ? 'مكالمة فيديو' : 'مكالمة هاتفية'}
            </Text>
            <Text style={styles.callStatusSub}>جاري الاتصال...</Text>
          </View>

          <View style={styles.callCenterAvatarWrap}>
            <View
              style={[
                styles.callAvatarCircle,
                callType === 'video' && styles.videoCallAvatarCircle,
              ]}
            >
              <Text style={styles.callAvatarLetter}>
                {activeChatFriend?.name.slice(0, 1) || 'أ'}
              </Text>
            </View>
            <Text style={styles.callPeerName}>
              {activeChatFriend?.name || 'صديق'}
            </Text>
            <Text style={styles.callPeerHandle}>
              {activeChatFriend?.handle || '@user'}
            </Text>
          </View>

          <View style={styles.callControlsRow}>
            <TouchableOpacity
              style={[styles.callControlBtn, isMuted && styles.callControlBtnActive]}
              onPress={() => setIsMuted((prev) => !prev)}
            >
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.callControlLabel}>
                {isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.callControlBtn, isSpeaker && styles.callControlBtnActive]}
              onPress={() => setIsSpeaker((prev) => !prev)}
            >
              <Ionicons
                name={isSpeaker ? 'volume-high' : 'volume-medium'}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.callControlLabel}>السماعة</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endCallBtn} onPress={endCall}>
              <Ionicons name="call" size={26} color="#FFFFFF" />
              <Text style={styles.callControlLabel}>إنهاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveChatFriend(null);
            setBottomTab('home');
          }}
        >
          <Ionicons
            name={bottomTab === 'home' ? 'home' : 'home-outline'}
            size={21}
            color={bottomTab === 'home' ? '#A855F7' : '#9CA3AF'}
          />
          <Text
            style={[
              styles.navLabel,
              bottomTab === 'home' && styles.navLabelActive,
            ]}
          >
            الرئيسية
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveChatFriend(null);
            setBottomTab('search');
          }}
        >
          <Ionicons
            name={bottomTab === 'search' ? 'search' : 'search-outline'}
            size={21}
            color={bottomTab === 'search' ? '#A855F7' : '#9CA3AF'}
          />
          <Text
            style={[
              styles.navLabel,
              bottomTab === 'search' && styles.navLabelActive,
            ]}
          >
            بحث
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveChatFriend(null);
            setFriendsSubTab('friends');
            setBottomTab('friends');
          }}
        >
          <View>
            <Ionicons
              name={bottomTab === 'friends' ? 'people' : 'people-outline'}
              size={21}
              color={bottomTab === 'friends' ? '#A855F7' : '#9CA3AF'}
            />
            {incomingRequests.length > 0 && (
              <View style={styles.navRedDot}>
                <Text style={styles.miniBadgeText}>{incomingRequests.length}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.navLabel,
              bottomTab === 'friends' && styles.navLabelActive,
            ]}
          >
            الأصدقاء
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setBottomTab('chats')}
        >
          <View>
            <Ionicons
              name={
                bottomTab === 'chats'
                  ? 'chatbubble-ellipses'
                  : 'chatbubble-ellipses-outline'
              }
              size={21}
              color={bottomTab === 'chats' ? '#A855F7' : '#9CA3AF'}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              bottomTab === 'chats' && styles.navLabelActive,
            ]}
          >
            المحادثات
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveChatFriend(null);
            setBottomTab('profile');
          }}
        >
          <Ionicons
            name={bottomTab === 'profile' ? 'person' : 'person-outline'}
            size={21}
            color={bottomTab === 'profile' ? '#A855F7' : '#9CA3AF'}
          />
          <Text
            style={[
              styles.navLabel,
              bottomTab === 'profile' && styles.navLabelActive,
            ]}
          >
            ملفي
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0914',
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#110E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#231D3A',
  },
  iconActionBtn: {
    position: 'relative',
    padding: 4,
  },
  redBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  redBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  miniBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  brandCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeLetter: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileMiniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B2F63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMiniText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollBody: {
    paddingBottom: 24,
  },
  sectionBox: {
    margin: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#161226',
    borderWidth: 1,
    borderColor: '#261F3E',
    gap: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
  },
  linkActionText: {
    color: '#C084FC',
    fontSize: 12,
    fontWeight: '700',
  },
  subTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#1F1836',
    alignItems: 'center',
  },
  subTabBtnActive: {
    backgroundColor: '#7C3AED',
  },
  subTabText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0B1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#312754',
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'right',
  },
  storiesRow: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    gap: 6,
  },
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2.5,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#261F3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyLetter: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  storyName: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
  composerCard: {
    marginHorizontal: 12,
    backgroundColor: '#161226',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#261F3E',
    gap: 10,
  },
  composerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  composerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#3B2F63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  composerInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'right',
  },
  pickedMediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#21193B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pickedMediaText: {
    color: '#E9D5FF',
    fontSize: 12,
    fontWeight: '600',
  },
  composerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#231D3A',
  },
  composerIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1E1734',
  },
  composerBtnLabel: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
  publishPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  publishPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  filtersRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#19142B',
    borderWidth: 1,
    borderColor: '#292147',
  },
  filterChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#9333EA',
  },
  filterText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  friendsMediaSection: {
    marginHorizontal: 12,
    marginBottom: 14,
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#161226',
    borderWidth: 1,
    borderColor: '#261F3E',
    gap: 10,
  },
  friendsMediaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendsMediaRow: {
    gap: 10,
  },
  friendMediaCard: {
    width: 158,
    backgroundColor: '#1E1834',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#2E254F',
    gap: 6,
  },
  friendMediaThumbWrap: {
    position: 'relative',
    width: '100%',
    height: 92,
    borderRadius: 10,
    overflow: 'hidden',
  },
  friendMediaThumb: {
    width: '100%',
    height: '100%',
  },
  friendMediaPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2049',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaTypeTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(11, 9, 20, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mediaTypeTagText: {
    color: '#E9D5FF',
    fontSize: 10,
    fontWeight: '700',
  },
  friendMediaAuthor: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  friendMediaBtnsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  watchSmallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: '#5B21B6',
    paddingVertical: 5,
    borderRadius: 8,
  },
  downloadSmallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: '#047857',
    paddingVertical: 5,
    borderRadius: 8,
  },
  downloadedDoneBtn: {
    backgroundColor: '#374151',
  },
  smallActionLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  postCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#161226',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#261F3E',
    gap: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postAuthorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postAuthorName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  postTime: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },
  postContent: {
    color: '#F3F4F6',
    fontSize: 14,
    textAlign: 'right',
    lineHeight: 21,
  },
  mediaCardBox: {
    gap: 8,
  },
  postImagePreview: {
    width: '100%',
    height: 170,
    borderRadius: 14,
  },
  mediaBanner: {
    height: 150,
    borderRadius: 14,
    backgroundColor: '#1F1836',
    borderWidth: 1,
    borderColor: '#34295C',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mediaBannerText: {
    color: '#DDD6FE',
    fontSize: 13,
    fontWeight: '600',
  },
  postMediaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  postActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#251C42',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A2C66',
  },
  postActionDone: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  postActionBtnText: {
    color: '#F3E8FF',
    fontSize: 12,
    fontWeight: '700',
  },
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 5, 12, 0.92)',
    justifyContent: 'center',
    padding: 16,
  },
  previewModalCard: {
    backgroundColor: '#161226',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#312754',
    gap: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  previewFullImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#0B0914',
  },
  previewEmptyBox: {
    height: 200,
    borderRadius: 12,
    backgroundColor: '#1E1834',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  previewCaption: {
    color: '#E5E7EB',
    fontSize: 13,
    textAlign: 'right',
  },
  modalDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    paddingVertical: 10,
    borderRadius: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#110E1E',
    borderTopWidth: 1,
    borderTopColor: '#231D3A',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minWidth: 56,
  },
  navLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#C084FC',
    fontWeight: '700',
  },
  navRedDot: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  userRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D1733',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2E254F',
    gap: 10,
  },
  userRowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRowAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  userRowMeta: {
    flex: 1,
  },
  userRowName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  userRowHandle: {
    color: '#A78BFA',
    fontSize: 11,
    textAlign: 'right',
  },
  userRowBio: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },
  chatQuickIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  miniCallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#31235E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectPillBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  friendActivePillBtn: {
    backgroundColor: '#374151',
  },
  acceptPillBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rejectPillBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removePillBtn: {
    backgroundColor: '#4B5563',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  reqButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  profileHeaderCard: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  profileBigAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6D28D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  profileBigAvatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  profileHandle: {
    color: '#A78BFA',
    fontSize: 12,
  },
  profileStats: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 4,
  },
  chatRoomContainer: {
    flex: 1,
    backgroundColor: '#0E0B1A',
  },
  chatRoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#161226',
    borderBottomWidth: 1,
    borderBottomColor: '#261F3E',
  },
  chatRoomHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 6,
  },
  onlineStatusText: {
    color: '#34D399',
    fontSize: 11,
    textAlign: 'right',
  },
  callActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  voiceCallBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCallBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    padding: 14,
    gap: 10,
  },
  messageBubble: {
    maxWidth: '78%',
    padding: 10,
    borderRadius: 14,
    gap: 4,
  },
  myMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#6D28D9',
  },
  theirMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E1834',
    borderWidth: 1,
    borderColor: '#2E254F',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'right',
  },
  messageTime: {
    color: '#E9D5FF',
    fontSize: 10,
    textAlign: 'left',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#141024',
    borderTopWidth: 1,
    borderTopColor: '#261F3E',
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#0B0914',
    color: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#2E254F',
  },
  sendMsgBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callScreen: {
    flex: 1,
    backgroundColor: '#0B0914',
    justifyContent: 'space-between',
    paddingVertical: 44,
    paddingHorizontal: 20,
  },
  callTopInfo: {
    alignItems: 'center',
    gap: 4,
  },
  callModeLabel: {
    color: '#E9D5FF',
    fontSize: 16,
    fontWeight: '800',
  },
  callStatusSub: {
    color: '#A78BFA',
    fontSize: 13,
  },
  callCenterAvatarWrap: {
    alignItems: 'center',
    gap: 10,
  },
  callAvatarCircle: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  videoCallAvatarCircle: {
    borderRadius: 28,
    width: 130,
    height: 160,
    backgroundColor: '#271A4A',
  },
  callAvatarLetter: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
  },
  callPeerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  callPeerHandle: {
    color: '#C4B5FD',
    fontSize: 13,
  },
  callControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  callControlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1E1834',
    gap: 4,
  },
  callControlBtnActive: {
    backgroundColor: '#6D28D9',
  },
  endCallBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DC2626',
    gap: 4,
  },
  callControlLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default WexoHomeScreen;
