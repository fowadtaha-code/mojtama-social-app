import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  I18nManager,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import FriendsScreen from "./FriendsScreen";
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
}

type FilterTab = 'الكل' | 'الصور' | 'الفيديوهات' | 'المنشورات';
type BottomTab = 'الرئيسية' | 'بحث' | 'المحادثات' | 'ملفي';

interface StoryItem {
  id: string;
  name: string;
  avatar: string;
  ringColors: [string, string];
  storyText: string;
}

interface PostItem {
  id: string;
  author: string;
  verified: boolean;
  timeAgo: string;
  content: string;
  avatar: string;
  image?: string;
  type: 'الصور' | 'الفيديوهات' | 'المنشورات';
  likes: number;
  comments: string[];
  reposts: number;
  liked?: boolean;
}

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: { id: string; text: string; fromMe: boolean }[];
}

const STORIES: StoryItem[] = [
  {
    id: '1',
    name: 'أحمد',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200',
    ringColors: ['#4F8CFF', '#9B4DFF'],
    storyText: 'صباح الخير من شاطئ البحر 🌊✨',
  },
  {
    id: '2',
    name: 'سارة',
    avatar: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200',
    ringColors: ['#9B82F6', '#8B5CF6'],
    storyText: 'أجواء المساء الجميلة في المدينة 🌆',
  },
  {
    id: '3',
    name: 'محمد',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
    ringColors: ['#EC4899', '#8B5CF6'],
    storyText: 'رفيقي الجديد اليوم 🐱💜',
  },
  {
    id: '4',
    name: 'ليلى',
    avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200',
    ringColors: ['#22C55E', '#3B82F6'],
    storyText: 'رحلة وسط الطبيعة والهدوء 🌲',
  },
];

const INITIAL_POSTS: PostItem[] = [
  {
    id: 'p1',
    author: 'أحمد الشمري',
    verified: true,
    timeAgo: 'منذ 2 س',
    content: 'أحياناً .. كل ما نحتاجه هو لحظة هدوء وموسيقى جميلة 💜',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    type: 'الصور',
    likes: 124,
    comments: ['كلام جميل جداً 👏', 'صورة رائعة تبعث على الراحة'],
    reposts: 18,
    liked: false,
  },
  {
    id: 'p2',
    author: 'سارة العتيبي',
    verified: true,
    timeAgo: 'منذ 4 س',
    content: 'تطبيق AFORA يجمعنا في مكان واحد بتصميم عصري وسريع! شاركونا آراءكم بالتحديث الجديد 🚀',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    type: 'المنشورات',
    likes: 89,
    comments: ['بالتوفيق! التطبيق ممتاز'],
    reposts: 12,
    liked: true,
  },
];

const INITIAL_CHATS: ChatItem[] = [
  {
    id: 'c1',
    name: 'أحمد الشمري',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    lastMessage: 'أهلاً بك في مجتمع AFORA!',
    time: '1:15 م',
    unread: 2,
    messages: [
      { id: 'm1', text: 'السلام عليكم، كيف حالك؟', fromMe: false },
      { id: 'm2', text: 'أهلاً بك في مجتمع AFORA!', fromMe: false },
    ],
  },
  {
    id: 'c2',
    name: 'سارة العتيبي',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    lastMessage: 'هل جربت ميزة النشر الجديدة؟',
    time: '11:40 ص',
    unread: 3,
    messages: [
      { id: 'm1', text: 'مرحباً! التصميم الجديد رائع جداً', fromMe: false },
      { id: 'm2', text: 'هل جربت ميزة النشر الجديدة؟', fromMe: false },
    ],
  },
];

export default function AforaHomeScreen() {
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>('الرئيسية');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('الكل');
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');

  // حالات نافذة النشر (+)
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');

  // حالات المحادثات
  const [chats, setChats] = useState<ChatItem[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessageInput, setChatMessageInput] = useState('');

  // حالات التعليقات والقصص والإشعارات
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';

  // إضافة منشور جديد
  const handlePublishPost = () => {
    const trimmed = newPostText.trim();
    if (!trimmed) {
      Alert.alert('تنبيه', 'يرجى كتابة نص المنشور أولاً.');
      return;
    }

    const created: PostItem = {
      id: Date.now().toString(),
      author: 'مستخدم AFORA',
      verified: true,
      timeAgo: 'الآن',
      content: trimmed,
      avatar: userAvatar,
      image: newPostImageUrl.trim() ? newPostImageUrl.trim() : undefined,
      type: newPostImageUrl.trim() ? 'الصور' : 'المنشورات',
      likes: 0,
      comments: [],
      reposts: 0,
      liked: false,
    };

    setPosts([created, ...posts]);
    setNewPostText('');
    setNewPostImageUrl('');
    setIsPostModalVisible(false);
    setActiveBottomTab('الرئيسية');
  };

  // تبديل الإعجاب
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  // إضافة تعليق
  const handleAddComment = () => {
    if (!commentPostId || !newCommentText.trim()) return;
    setPosts((prev) =>
      prev.map((post) =>
        post.id === commentPostId
          ? { ...post, comments: [...post.comments, newCommentText.trim()] }
          : post
      )
    );
    setNewCommentText('');
  };

  // إرسال رسالة في المحادثة
  const handleSendChatMessage = () => {
    if (!selectedChatId || !chatMessageInput.trim()) return;
    const msgText = chatMessageInput.trim();
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              lastMessage: msgText,
              time: 'الآن',
              unread: 0,
              messages: [
                ...chat.messages,
                { id: Date.now().toString(), text: msgText, fromMe: true },
              ],
            }
          : chat
      )
    );
    setChatMessageInput('');
  };

  // تصفية المنشورات حسب التبويب أو البحث
  const filteredPosts = posts.filter((post) => {
    const matchesFilter = activeFilter === 'الكل' || post.type === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      post.content.includes(searchQuery.trim()) ||
      post.author.includes(searchQuery.trim());
    return matchesFilter && matchesSearch;
  });

  const totalUnreadChats = chats.reduce((sum, c) => sum + c.unread, 0);
  const selectedChat = chats.find((c) => c.id === selectedChatId) || null;
  const activeCommentPost = posts.find((p) => p.id === commentPostId) || null;

  // عرض بطاقة المنشور
  const renderPostCard = (post: PostItem) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('خيارات المنشور', 'اختر إجراءً:', [
              {
                text: 'حذف المنشور',
                style: 'destructive',
                onPress: () => setPosts((prev) => prev.filter((p) => p.id !== post.id)),
              },
              { text: 'إلغاء', style: 'cancel' },
            ])
          }
        >
          <Feather name="more-horizontal" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.postAuthorRow}>
          <View style={styles.postAuthorInfo}>
            <View style={styles.authorNameRow}>
              {post.verified && (
                <Ionicons name="checkmark-circle" size={16} color="#3B82F6" style={{ marginLeft: 4 }} />
              )}
              <Text style={styles.authorName}>{post.author}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{post.timeAgo}</Text>
              <Ionicons name="globe-outline" size={12} color="#9CA3AF" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}

      <View style={styles.postActionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            setPosts((prev) =>
              prev.map((p) => (p.id === post.id ? { ...p, reposts: p.reposts + 1 } : p))
            )
          }
        >
          <Feather name="repeat" size={17} color="#9CA3AF" />
          <Text style={styles.actionCount}>{post.reposts}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setCommentPostId(post.id)}>
          <Ionicons name="chatbubble-outline" size={17} color="#9CA3AF" />
          <Text style={styles.actionCount}>{post.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggleLike(post.id)}>
          <Ionicons
            name={post.liked ? 'heart' : 'heart-outline'}
            size={19}
            color={post.liked ? '#EC4899' : '#9CA3AF'}
          />
          <Text style={[styles.actionCount, post.liked && { color: '#EC4899' }]}>{post.likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B14" />

      {/* الشريط العلوي */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerLeftGroup}
          onPress={() => setActiveBottomTab('ملفي')}
        >
          <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
          <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>AFORA</Text>
          <LinearGradient colors={['#8B5CF6', '#6366F1']} style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>A</Text>
          </LinearGradient>
        </View>

        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => {
            setUnreadNotifications(0);
            Alert.alert('الإشعارات', 'أهلاً بك! لديك 3 إشعارات ترحيبية في مجتمع AFORA.');
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          {unreadNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* محتوى التبويبات */}
      {activeBottomTab === 'الرئيسية' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* شريط القصص */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          >
            {STORIES.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyItem}
                onPress={() => setActiveStory(story)}
              >
                <LinearGradient colors={story.ringColors} style={styles.storyRing}>
                  <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
                </LinearGradient>
                <Text style={styles.storyName}>{story.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* صندوق إنشاء منشور سريع */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.quickPostBox}
            onPress={() => setIsPostModalVisible(true)}
          >
            <View style={styles.quickPostIcons}>
              <TouchableOpacity onPress={() => setIsPostModalVisible(true)}>
                <Feather name="edit" size={19} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPostModalVisible(true)}>
                <Feather name="video" size={19} color="#EC4899" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPostModalVisible(true)}>
                <Feather name="image" size={19} color="#8B5CF6" />
              </TouchableOpacity>
            </View>

            <View style={styles.quickPostRight}>
              <Text style={styles.quickPostPlaceholder}>بم تفكر الآن؟ انشر شيئاً...</Text>
              <Image source={{ uri: userAvatar }} style={styles.quickPostAvatar} />
            </View>
          </TouchableOpacity>

          {/* أزرار الفلترة */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            {(['الكل', 'الصور', 'الفيديوهات', 'المنشورات'] as FilterTab[]).map((tab) => {
              const isSelected = activeFilter === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setActiveFilter(tab)}
                >
                  <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* قائمة المنشورات */}
          {filteredPosts.length > 0 ? (
            filteredPosts.map(renderPostCard)
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>لا توجد منشورات في هذا القسم حالياً.</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* تبويب البحث */}
 {/* تبويب البحث */}
{activeBottomTab === 'بحث' && (
  <View style={{ flex: 1 }}>
    <FriendsScreen />
  </View>
)}
      {/* تبويب المحادثات */}
      {activeBottomTab === 'المحادثات' && (
        <View style={{ flex: 1 }}>
          {!selectedChat ? (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>المحادثات ({chats.length})</Text>
              {chats.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  style={styles.chatRow}
                  onPress={() => {
                    setSelectedChatId(chat.id);
                    setChats((prev) =>
                      prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
                    );
                  }}
                >
                  <View style={styles.chatMeta}>
                    <Text style={styles.chatTime}>{chat.time}</Text>
                    {chat.unread > 0 && (
                      <View style={styles.chatUnreadBadge}>
                        <Text style={styles.badgeText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.chatInfo}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.chatLastMsg} numberOfLines={1}>
                      {chat.lastMessage}
                    </Text>
                  </View>

                  <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={styles.chatDetailHeader}>
                <TouchableOpacity onPress={() => setSelectedChatId(null)}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.chatName}>{selectedChat.name}</Text>
                <Image source={{ uri: selectedChat.avatar }} style={styles.headerAvatar} />
              </View>

              <ScrollView contentContainerStyle={{ padding: 16 }}>
                {selectedChat.messages.map((m) => (
                  <View
                    key={m.id}
                    style={[
                      styles.msgBubble,
                      m.fromMe ? styles.msgBubbleMe : styles.msgBubbleOther,
                    ]}
                  >
                    <Text style={styles.msgText}>{m.text}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.chatInputBar}>
                <TouchableOpacity style={styles.sendBtn} onPress={handleSendChatMessage}>
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <TextInput
                  style={styles.chatTextInput}
                  placeholder="اكتب رسالتك هنا..."
                  placeholderTextColor="#6B7280"
                  value={chatMessageInput}
                  onChangeText={setChatMessageInput}
                  textAlign="right"
                />
              </View>
            </KeyboardAvoidingView>
          )}
        </View>
      )}

      {/* تبويب ملفي */}
      {activeBottomTab === 'ملفي' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileCard}>
            <Image source={{ uri: userAvatar }} style={styles.profileLargeAvatar} />
            <Text style={styles.profileName}>مستخدم AFORA</Text>
            <Text style={styles.profileHandle}>@afora_member</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>منشورات</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>142</Text>
                <Text style={styles.statLabel}>متابِعون</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>85</Text>
                <Text style={styles.statLabel}>يتابع</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() => setIsPostModalVisible(true)}
            >
              <Text style={styles.primaryActionBtnText}>+ إضافة منشور جديد</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* شريط التنقل السفلي وزر النشر (+) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedChatId(null);
            setActiveBottomTab('ملفي');
          }}
        >
          <Ionicons
            name={activeBottomTab === 'ملفي' ? 'person' : 'person-outline'}
            size={22}
            color={activeBottomTab === 'ملفي' ? '#8B5CF6' : '#9CA3AF'}
          />
          <Text style={[styles.navText, activeBottomTab === 'ملفي' && styles.navTextActive]}>
            ملفي
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedChatId(null);
            setActiveBottomTab('المحادثات');
          }}
        >
          <View>
            <Ionicons
              name={activeBottomTab === 'المحادثات' ? 'chatbubbles' : 'chatbubbles-outline'}
              size={22}
              color={activeBottomTab === 'المحادثات' ? '#8B5CF6' : '#9CA3AF'}
            />
            {totalUnreadChats > 0 && (
              <View style={styles.chatBadge}>
                <Text style={styles.badgeText}>{totalUnreadChats}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navText, activeBottomTab === 'المحادثات' && styles.navTextActive]}>
            المحادثات
          </Text>
        </TouchableOpacity>

        {/* زر النشر الأوسط (+) */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.centerPlusWrapper}
          onPress={() => setIsPostModalVisible(true)}
        >
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.centerPlusButton}>
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedChatId(null);
            setActiveBottomTab('بحث');
          }}
        >
          <Ionicons
            name={activeBottomTab === 'بحث' ? 'search' : 'search-outline'}
            size={22}
            color={activeBottomTab === 'بحث' ? '#8B5CF6' : '#9CA3AF'}
          />
          <Text style={[styles.navText, activeBottomTab === 'بحث' && styles.navTextActive]}>
            بحث
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedChatId(null);
            setActiveBottomTab('الرئيسية');
          }}
        >
          <Ionicons
            name={activeBottomTab === 'الرئيسية' ? 'home' : 'home-outline'}
            size={22}
            color={activeBottomTab === 'الرئيسية' ? '#8B5CF6' : '#9CA3AF'}
          />
          <Text style={[styles.navText, activeBottomTab === 'الرئيسية' && styles.navTextActive]}>
            الرئيسية
          </Text>
        </TouchableOpacity>
      </View>

      {/* نافذة إنشاء منشور جديد (+) */}
      <Modal visible={isPostModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsPostModalVisible(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>منشور جديد</Text>
              <TouchableOpacity style={styles.publishBtn} onPress={handlePublishPost}>
                <Text style={styles.publishBtnText}>نشر</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalTextArea}
              placeholder="اكتب ما يدور في ذهنك هنا..."
              placeholderTextColor="#6B7280"
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
              textAlign="right"
            />

            <TextInput
              style={styles.modalUrlInput}
              placeholder="رابط صورة (اختياري) https://..."
              placeholderTextColor="#6B7280"
              value={newPostImageUrl}
              onChangeText={setNewPostImageUrl}
              textAlign="right"
            />
          </View>
        </View>
      </Modal>

      {/* نافذة التعليقات */}
      <Modal visible={!!activeCommentPost} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setCommentPostId(null)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>التعليقات</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              {activeCommentPost?.comments.length ? (
                activeCommentPost.comments.map((c, idx) => (
                  <View key={idx} style={styles.commentItem}>
                    <Text style={styles.commentText}>{c}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>لا توجد تعليقات بعد. كن أول من يعلق!</Text>
              )}
            </ScrollView>

            <View style={styles.chatInputBar}>
              <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TextInput
                style={styles.chatTextInput}
                placeholder="أضف تعليقاً..."
                placeholderTextColor="#6B7280"
                value={newCommentText}
                onChangeText={setNewCommentText}
                textAlign="right"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* نافذة عرض القصة (Story) */}
      <Modal visible={!!activeStory} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.storyModalCard}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setActiveStory(null)}>
                <Ionicons name="close" size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{activeStory?.name}</Text>
              <View style={{ width: 26 }} />
            </View>
            {activeStory && (
              <>
                <Image source={{ uri: activeStory.avatar }} style={styles.storyFullImage} />
                <Text style={styles.storyFullText}>{activeStory.storyText}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B14',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#19192B',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  bellButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 14,
  },
  storiesContainer: {
    paddingVertical: 14,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
  },
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0B0B14',
  },
  storyName: {
    color: '#E5E7EB',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  quickPostBox: {
    backgroundColor: '#151525',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#23233A',
    marginBottom: 14,
  },
  quickPostIcons: {
    flexDirection: 'row',
    gap: 14,
  },
  quickPostRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quickPostPlaceholder: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  quickPostAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  filtersRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: '#151525',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#23233A',
  },
  filterPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#8B5CF6',
  },
  filterText: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  postCard: {
    backgroundColor: '#151525',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#23233A',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postAuthorInfo: {
    alignItems: 'flex-end',
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  postAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  postContent: {
    color: '#F3F4F6',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 210,
    borderRadius: 14,
    marginBottom: 12,
  },
  postActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#23233A',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#121220',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#23233A',
    paddingBottom: 6,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#8B5CF6',
  },
  chatBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlusWrapper: {
    marginTop: -28,
  },
  centerPlusButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0B0B14',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151525',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#23233A',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
    marginVertical: 10,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151525',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#23233A',
  },
  chatMeta: {
    alignItems: 'flex-start',
    gap: 4,
  },
  chatTime: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  chatUnreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 12,
  },
  chatName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  chatLastMsg: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chatDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#151525',
    borderBottomWidth: 1,
    borderBottomColor: '#23233A',
  },
  msgBubble: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    maxWidth: '80%',
  },
  msgBubbleMe: {
    backgroundColor: '#7C3AED',
    alignSelf: 'flex-end',
  },
  msgBubbleOther: {
    backgroundColor: '#1E1E32',
    alignSelf: 'flex-start',
  },
  msgText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#151525',
    borderTopWidth: 1,
    borderTopColor: '#23233A',
    marginBottom: 72,
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#0B0B14',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: '#7C3AED',
    padding: 10,
    borderRadius: 12,
  },
  profileCard: {
    backgroundColor: '#151525',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#23233A',
  },
  profileLargeAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    marginBottom: 12,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileHandle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#23233A',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  primaryActionBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#151525',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2E2E4A',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  publishBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalTextArea: {
    backgroundColor: '#0B0B14',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    minHeight: 110,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  modalUrlInput: {
    backgroundColor: '#0B0B14',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
  },
  commentItem: {
    backgroundColor: '#0B0B14',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  commentText: {
    color: '#E5E7EB',
    textAlign: 'right',
  },
  storyModalCard: {
    backgroundColor: '#151525',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  storyFullImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginVertical: 12,
  },
  storyFullText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});
