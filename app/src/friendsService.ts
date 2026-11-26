import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: number;
  name: string;
  username: string;
}

export interface FriendsState {
  addedIds: number[];   // قائمة الإضافات / الطلبات
  friendsIds: number[]; // قائمة الأصدقاء المؤكدين
}

const STORAGE_KEY = "@mojtama_friends_state_v1";

export const INITIAL_USERS: User[] = [
  { id: 1, name: "أحمد المنصور", username: "@ahmed_m" },
  { id: 2, name: "سارة العتيبي", username: "@sara_otb" },
  { id: 3, name: "محمد الشهري", username: "@m_alshahri" },
  { id: 4, name: "نورة القحطاني", username: "@noura_q" },
  { id: 5, name: "خالد الدوسري", username: "@khaled_d" },
  { id: 6, name: "ليلى الحربي", username: "@layla_h" },
];

export const DEFAULT_FRIENDS_STATE: FriendsState = {
  addedIds: [2],
  friendsIds: [1],
};

// تحميل حالة الأصدقاء والإضافات
export async function loadFriendsState(): Promise<FriendsState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FRIENDS_STATE;
    const parsed = JSON.parse(raw) as Partial<FriendsState>;
    return {
      addedIds: Array.isArray(parsed.addedIds) ? parsed.addedIds : [],
      friendsIds: Array.isArray(parsed.friendsIds) ? parsed.friendsIds : [],
    };
  } catch (error) {
    console.error("Error loading friends state:", error);
    return DEFAULT_FRIENDS_STATE;
  }
}

// حفظ حالة الأصدقاء والإضافات
export async function saveFriendsState(state: FriendsState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving friends state:", error);
  }
}

// البحث في المستخدمين بالاسم أو اسم المستخدم
export function searchUsers(users: User[], query: string): User[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return users;

  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(normalized) ||
      user.username.toLowerCase().includes(normalized)
  );
}

// إضافة مستخدم إلى قائمة الإضافات
export function addToAddedList(state: FriendsState, userId: number): FriendsState {
  if (state.addedIds.includes(userId) || state.friendsIds.includes(userId)) {
    return state;
  }
  return {
    ...state,
    addedIds: [...state.addedIds, userId],
  };
}

// إلغاء الإضافة
export function cancelAddedUser(state: FriendsState, userId: number): FriendsState {
  return {
    ...state,
    addedIds: state.addedIds.filter((id) => id !== userId),
  };
}

// نقل المستخدم من قائمة الإضافات إلى الأصدقاء
export function confirmFriendRequest(state: FriendsState, userId: number): FriendsState {
  return {
    addedIds: state.addedIds.filter((id) => id !== userId),
    friendsIds: state.friendsIds.includes(userId)
      ? state.friendsIds
      : [...state.friendsIds, userId],
  };
}

// إزالة صديق
export function removeFriendUser(state: FriendsState, userId: number): FriendsState {
  return {
    ...state,
    friendsIds: state.friendsIds.filter((id) => id !== userId),
  };
}
