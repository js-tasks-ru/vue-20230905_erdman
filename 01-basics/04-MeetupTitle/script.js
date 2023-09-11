import { createApp, defineComponent } from './vendor/vue.esm-browser';

const API_URL = 'https://course-vue.javascript.ru/api';

function fetchMeetupById(meetupId) {
  return fetch(`${API_URL}/meetups/${meetupId}`).then((response) => {
    if (response.ok) {
      return response.json();
    }

    return response.json().then((error) => {
      throw error;
    });
  });
}

const RootComponent = defineComponent({
  data() {
    return {
      meetupId: null,
      meetupTitle: null,
    };
  },

  watch: {
    async meetupId(newId) {
      const meetup = await fetchMeetupById(newId);

      this.meetupTitle = meetup.title;
    },
  },
});

const app = createApp(RootComponent);
const vm = app.mount('#app');
