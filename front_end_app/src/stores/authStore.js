import { defineStore } from 'pinia';
import userService from "@/services/userService.js";

export const authStore = defineStore(
  'auth',
  {
    state: () => ({
      user: null,
    }),
    getters: {
      isAuthenticated: (state) => !!state.user,
      authUser: (state) => {
        if (state.user === null) throw new Error('no data');
        return state.user;
      },
    },
    actions: {
      async loginWithId(loginId) {
        const response = await userService.userFind(loginId);
        console.log('auth response : ',response);
        if (response.status === 200) {
          this.user = response.data;
          console.log('this.user : ',this.user);
        }
      },
      async logout() {
        this.$reset();
      },
    },
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'user',
          paths: ['user'],
          storage: localStorage,
        },
      ],
    },
  }
);
