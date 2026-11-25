import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';

interface Post {
  id: string;
  author: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  liked: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'أفورا الرسمي',
    handle: '@afora',
    time: 'الآن',
    content: 'أهلاً بكم في مجتمع أفورا (AFORA) — مساحة تواصل جديدة ومباشرة.',
    likes: 12,
    liked: false,
  },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [draft, setDraft] = useState('');

  const handleAddPost = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: 'عضو أفورا',
      handle: '@member',
      time: 'الآن',
      content: trimmed,
      likes: 0,
      liked: false,
    };

    setPosts([newPost, ...posts]);
    setDraft('');
  };

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <Text style={styles.brandTitle}>AFORA</Text>
        <Text style={styles.brandSubtitle}>مجتمعك الرقمي</Text>
      </View>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="شارك فكرة أو منشوراً جديداً على AFORA..."
          placeholderTextColor="#94A3B8"
          value={draft}
          onChangeText={setDraft}
          multiline
        />
        <TouchableOpacity style={styles.publishButton} onPress={handleAddPost}>
          <Text style={styles.publishButtonText}>نشر</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.authorName}>{item.author}</Text>
                <Text style={styles.handleText}>{item.handle}</Text>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>

            <Text style={styles.postBody}>{item.content}</Text>

            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => handleToggleLike(item.id)}
            >
              <Text style={[styles.likeText, item.liked && styles.likeTextActive]}>
                {item.liked ? '♥ أعجبني' : '♡ إعجاب'} ({item.likes})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  composer: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#111827',
  },
  input: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 68,
    textAlignVertical: 'top',
  },
  publishButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 8,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  feed: {
    padding: 14,
    gap: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorName: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 15,
  },
  handleText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  timeText: {
    color: '#64748B',
    fontSize: 12,
  },
  postBody: {
    color: '#E2E8F0',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  likeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#0F172A',
  },
  likeText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  likeTextActive: {
    color: '#F43F5E',
  },
});
