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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';

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
}

interface PostItem {
  id: string;
  author: string;
  verified: boolean;
  timeAgo: string;
  content: string;
  avatar: string;
  image?: string;
  likes: string;
  comments: string;
  reposts: string;
  liked?: boolean;
}

const STORIES: StoryItem[] = [
  {
    id: '1',
    name: 'أحمد',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200',
    ringColors: ['#4F8CFF', '#9B4DFF'],
  },
  {
    id: '2',
    name: 'سارة',
    avatar: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200',
    ringColors: ['#3B82F6', '#8B5CF6'],
  },
  {
    id: '3',
    name: 'محمد',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
    ringColors: ['#EC4899', '#8B5CF6'],
  },
  {
    id: '4',
    name: 'ليلى',
    avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200',
    ringColors: ['#22C55E', '#3B82F6'],
  },
];

const POSTS: PostItem[] = [
  {
    id: 'p1',
    author: 'أحمد الشمري',
    verified: true,
    timeAgo: 'منذ 2 س',
    content: 'أحياناً .. كل ما نحتاجه هو لحظة هدوء وموسيقى جميلة 💜',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900',
    likes: '24.6K',
    comments: '842',
    reposts: '1.2K',
    liked: true,
  },
  {
    id: 'p2',
    author: 'سارة العتيبي',
    verified: true,
    timeAgo: 'منذ 4 س',
    content: 'ابتسم .. فالحياة أجمل 💕',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900',
    likes: '11.4K',
    comments: '310',
    reposts: '490',
    liked: false,
  },
];

const FILTER_TABS: { key: FilterTab; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'الكل', icon: 'apps' },
  { key: 'الصور', icon: 'image-outline' },
  { key: 'الفيديوهات', icon: 'videocam-outline' },
  { key: 'المنشورات', icon: 'document-text-outline' },
];

export default function AforaHomeScreen() {
  const [postText, setPostText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('الكل');
  const [activeBottom, setActiveBottom] = useState<BottomTab>('الرئيسية');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({ p1: true });

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#070514" />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.bellButton} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={24} color="#F3F4F6" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.brandBox}>
          <LinearGradient
            colors={['#4DA6FF', '#8A4FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoMark}
          >
            <Text style={styles.logoMarkText}>A</Text>
          </LinearGradient>
          <Text style={styles.brandTitle}>AFORA</Text>
        </View>

        <TouchableOpacity style={styles.profileHeaderBtn} activeOpacity={0.8}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            }}
            style={styles.headerAvatar}
          />
          <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesRow}
        >
          <TouchableOpacity activeOpacity={0.85} style={styles.addStoryWrapper}>
            <LinearGradient
              colors={['#2563EB', '#7C3AED', '#4C1D95']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addStoryCard}
            >
              <View style={styles.plusCircle}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.addStoryLabel}>إضافة{'\n'}قصة</Text>
            </LinearGradient>
          </TouchableOpacity>

          {STORIES.map((story) => (
            <TouchableOpacity
              key={story.id}
              activeOpacity={0.85}
              style={styles.storyItem}
            >
              <LinearGradient
                colors={story.ringColors}
                style={styles.storyRing}
              >
                <View style={styles.storyInnerBorder}>
                  <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
                </View>
              </LinearGradient>
              <View style={styles.storyDot} />
              <Text style={styles.storyName} numberOfLines={1}>
                {story.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.composerCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            }}
            style={styles.composerAvatar}
          />
          <TextInput
            value={postText}
            onChangeText={setPostText}
            placeholder="ماذا يدور في بالك؟"
            placeholderTextColor="#7C7A96"
            style={styles.composerInput}
            textAlign="right"
          />
          <View style={styles.composerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="image-outline" size={20} color="#A855F7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="videocam-outline" size={20} color="#EC4899" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="edit" size={19} color="#60A5FA" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.key;
            if (isActive) {
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveFilter(tab.key)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#7C3AED', '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.activeFilterPill}
                  >
                    <Text style={styles.activeFilterText}>{tab.key}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                style={styles.inactiveFilterPill}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={
                    tab.key === 'الصور'
                      ? '#60A5FA'
                      : tab.key === 'الفيديوهات'
                      ? '#F472B6'
                      : '#34D399'
                  }
                />
                <Text style={styles.inactiveFilterText}>{tab.key}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {POSTS.map((post) => {
          const isLiked = !!likedIds[post.id];
          return (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <View style={styles.postAuthorRow}>
                  <View style={styles.postAuthorMeta}>
                    <View style={styles.nameWithBadge}>
                      <Text style={styles.postAuthorName}>{post.author}</Text>
                      {post.verified && (
                        <Ionicons
                          name="checkmark-circle"
                          size={15}
                          color="#3B82F6"
                          style={styles.verifiedIcon}
                        />
                      )}
                    </View>
                    <View style={styles.timeRow}>
                      <Ionicons name="globe-outline" size={12} color="#8E8CA8" />
                      <Text style={styles.postTime}>{post.timeAgo}</Text>
                    </View>
                  </View>
                  <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
                </View>
              </View>

              <Text style={styles.postContent}>{post.content}</Text>

              {post.image && (
                <Image source={{ uri: post.image }} style={styles.postImage} />
              )}

              <View style={styles.postFooter}>
                <View style={styles.leftActions}>
                  <TouchableOpacity
                    style={styles.statBtn}
                    onPress={() => toggleLike(post.id)}
                  >
                    <Ionicons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={19}
                      color={isLiked ? '#F43F5E' : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.statText,
                        isLiked && { color: '#F43F5E' },
                      ]}
                    >
                      {post.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.statBtn}>
                    <Ionicons name="chatbubble-outline" size={18} color="#9CA3AF" />
                    <Text style={styles.statText}>{post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.statBtn}>
                    <Feather name="repeat" size={18} color="#9CA3AF" />
                    <Text style={styles.statText}>{post.reposts}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.statBtn}>
                    <Ionicons name="paper-plane-outline" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity>
                  <Ionicons name="bookmark-outline" size={19} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveBottom('الرئيسية')}
        >
          <Ionicons
            name={activeBottom === 'الرئيسية' ? 'home' : 'home-outline'}
            size={22}
            color={activeBottom === 'الرئيسية' ? '#8B5CF6' : '#8E8CA8'}
          />
          <Text
            style={[
              styles.navLabel,
              activeBottom === 'الرئيسية' && styles.navLabelActive,
            ]}
          >
            الرئيسية
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveBottom('بحث')}
        >
          <Ionicons
            name="search-outline"
            size={22}
            color={activeBottom === 'بحث' ? '#8B5CF6' : '#8E8CA8'}
          />
          <Text
            style={[
              styles.navLabel,
              activeBottom === 'بحث' && styles.navLabelActive,
            ]}
          >
            بحث
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} style={styles.fabWrapper}>
          <LinearGradient
            colors={['#4F8CFF', '#9333EA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabCircle}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveBottom('المحادثات')}
        >
          <View>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={activeBottom === 'المحادثات' ? '#8B5CF6' : '#8E8CA8'}
            />
            <View style={styles.chatBadge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </View>
          <Text
            style={[
              styles.navLabel,
              activeBottom === 'المحادثات' && styles.navLabelActive,
            ]}
          >
            المحادثات
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveBottom('ملفي')}
        >
          <Ionicons
            name={activeBottom === 'ملفي' ? 'person' : 'person-outline'}
            size={22}
            color={activeBottom === 'ملفي' ? '#8B5CF6' : '#8E8CA8'}
          />
          <Text
            style={[
              styles.navLabel,
              activeBottom === 'ملفي' && styles.navLabelActive,
            ]}
          >
            ملفي
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070514',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bellButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  profileHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
  },
  scrollContent: {
    paddingBottom: 96,
  },
  storiesRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  addStoryWrapper: {
    width: 84,
    height: 122,
    borderRadius: 20,
    overflow: 'hidden',
  },
  addStoryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 8,
  },
  plusCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStoryLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
  storyItem: {
    alignItems: 'center',
    width: 78,
  },
  storyRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyInnerBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: '#070514',
    padding: 2,
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
  },
  storyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
    marginTop: -4,
  },
  storyName: {
    color: '#E5E7EB',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  composerCard: {
    marginHorizontal: 14,
    marginTop: 6,
    backgroundColor: '#131029',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#231E46',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  composerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  composerInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 2,
  },
  composerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    padding: 4,
  },
  filterRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  activeFilterPill: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  inactiveFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#131029',
    borderWidth: 1,
    borderColor: '#231E46',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  inactiveFilterText: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '600',
  },
  postCard: {
    marginHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#110E24',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1E1A3B',
    padding: 14,
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
  postAuthorMeta: {
    alignItems: 'flex-end',
  },
  nameWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  verifiedIcon: {
    marginRight: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  postTime: {
    color: '#8E8CA8',
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
    borderRadius: 16,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#0D0A1E',
    borderTopWidth: 1,
    borderTopColor: '#1E1A3B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minWidth: 54,
  },
  navLabel: {
    color: '#8E8CA8',
    fontSize: 11,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#A855F7',
    fontWeight: '700',
  },
  fabWrapper: {
    marginTop: -24,
  },
  fabCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  chatBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
});
