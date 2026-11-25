import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function App() {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([
    { id: '1', author: 'أحمد', content: 'أهلاً بك في تطبيق التواصل الاجتماعي الجديد! 🚀', likes: 3 }
  ]);

  const handleAddPost = () => {
    if (postText.trim() === '') return;
    setPosts([{ id: Date.now().toString(), author: 'أنت', content: postText, likes: 0 }, ...posts]);
    setPostText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>مجتمعنا 🌐</Text></View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="بماذا تفكر اليوم؟..." value={postText} onChangeText={setPostText} multiline />
        <TouchableOpacity style={styles.button} onPress={handleAddPost}><Text style={styles.buttonText}>نشر</Text></TouchableOpacity>
      </View>
      <ScrollView style={styles.feed}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postAuthor}>{post.author}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
