import { create } from 'zustand';
import { supabase } from './supabaseClient';

let expenses = (set, get) => ({
  data: [],
  category: [],
  edit: {},
  categoriesWithCount: [],

  fetchDataCategory: async () => {
    try {
      const { data: category, error } = await supabase
        .from('category')
        .select('*');
      if (error) {
        console.error(error);
      } else {
        set({ category: category, isLoading: false });
      }
    } catch (e) {
      console.error(e);
    }
  },
  addCategory: (name) =>
    set(async (state) => {
      const newCategory = {
        id: Date.now().toString(),
        category_name: name,
      };
      try {
        const { data, error } = await supabase.from('category').insert([
          {
            category_name: name,
          },
        ]);
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error(error);
      }

      return { category: [...state.category, newCategory] };
    }),
  subscribeToCategory: () => {
    const category = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'category',
        },

        async (payload) => {
          console.log('Received event:', payload.eventType, payload);
          if (payload.eventType === 'DELETE') {
            set((state) => ({
              category: state.category.filter((el) => el.id !== payload.old.id),
            }));
          } else if (payload.eventType === 'UPDATE') {
            const { data, error } = await supabase
              .from('category')
              .select('*')
              .eq('id', payload.new.id);

            if (error) {
              console.error(error);
            } else {
              set((state) => {
                const updatedCategory = state.category.map((el) => {
                  if (el.id === payload.new.id) {
                    return data[0];
                  } else {
                    return el;
                  }
                });
                return { category: updatedCategory };
              });
            }
          } else {
            await get().fetchDataCategory();
          }
        }
      )
      .subscribe();
  },
  fetchExpenses: async (id) => {
    await get().fetchDataCategory();
    let query = supabase.from('Expenseslist').select(`
      *,
      created_by,
      created_by (
        id,
        username,
        avatar_url
      ),
      edited_by (
        id,
        username,
        avatar_url
      ),
      category,
      category (
        id,
        category_name
      )
    `);

    if (id) {
      query = query.eq('id', id);
    }
    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else {
      set((state) => {
        const newData = data.filter(
          (item) => !state.data.find((i) => i.id === item.id)
        );
        const categoriesWithCount = state.category.map((category) => {
          const count = newData.filter(
            (item) => item.category.id === category.id
          ).length;
          return {
            ...category,
            count,
          };
        });

        return { data: [...newData, ...state.data], categoriesWithCount };
      });
    }
  },
  getCategoriesWithCount: () => {
    return get().categoriesWithCount;
  },
  subscribeToExpenses: () => {
    const Expenseslist = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Expenseslist',
        },

        async (payload) => {
          console.log('Received event:', payload.eventType, payload);
          if (payload.eventType === 'DELETE') {
            set((state) => ({
              data: state.data.filter((el) => el.id !== payload.old.id),
            }));
          } else if (payload.eventType === 'UPDATE') {
            const { data, error } = await supabase
              .from('Expenseslist')
              .select(
                `
                *,
                created_by (
                  id,
                  username,
                  avatar_url
                ),
                edited_by (
                  id,
                  username,
                  avatar_url
                ),
                category (
                  id,
                  category_name
                )
              `
              )
              .eq('id', payload.new.id);

            if (error) {
              console.error(error);
            } else {
              set((state) => {
                const updatedData = state.data.map((el) => {
                  if (el.id === payload.new.id) {
                    return data[0];
                  } else {
                    return el;
                  }
                });
                return { data: updatedData };
              });
            }
          } else {
            await get().fetchExpenses(payload.new.id);
          }
        }
      )
      .subscribe();
  },

  editExpns: (id) =>
    set((state) => {
      const updateExpenses = state.data.find((el) => el.id === id);
      return {
        edit: updateExpenses,
      };
    }),

  updateExpenseList: async (expenseId, expenseData) => {
    const { error } = await supabase
      .from('Expenseslist')
      .update(expenseData)
      .eq('id', expenseId);
    if (error) {
      console.error(error);
    } else {
      const { data, error } = await supabase
        .from('Expenseslist')
        .select('*')
        .order('id', { ascending: false });
      if (error) {
        console.error(error);
      }
    }
  },
  addExpens: async (obj) => {
    try {
      const { data, error } = await supabase.from('Expenseslist').insert([
        {
          text: obj.name,
          summ: parseInt(obj.sum),
          created_at: obj.date,
          category: obj.category_id,
          created_by: obj.created_by_id,
        },
      ]);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  removeExpens: async (id) => {
    try {
      const { data, error } = await supabase
        .from('Expenseslist')
        .delete()
        .eq('id', id);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  fetchDataCreatedBy: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username');

    if (error) {
      console.error(error);
    } else {
      set({ createdBy: data });
    }
  },
});

export const useExpenses = create(expenses);

export const useSessionStore = create((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));

export const useAvatarImgStore = create((set) => ({
  avatarUrl: null,
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  uploading: false,
  setUploading: (value) => set({ uploading: value }),
}));

export const useAccountStore = create((set) => ({
  loading: true,
  username: null,
  website: null,
  avatarUrl: null,
  fullName: null,
  avatarImg: null,
  setLoading: (loading) => set({ loading }),
  setUsername: (username) => set({ username }),
  setWebsite: (website) => set({ website }),
  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
  setFullName: (fullName) => set({ fullName }),
  downloadAvatar: async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      set({ avatarImg: url });
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  },
}));
