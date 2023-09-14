import { defineComponent } from '../vendor/vue.esm-browser.js';
import UiContainer from './UiContainer.js';
import UiAlert from './UiAlert.js';
import MeetupView from '../../06-MeetupView/components/MeetupView.js';
import { fetchMeetupById } from '../meetupService.js';


export default defineComponent({
  name: 'PageMeetup',

  components: {
    UiAlert,
    UiContainer,
    MeetupView,
  },

  props: {
    meetupId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      meetup: null,
      fetchError: null,
    };
  },

  watch: {
    meetupId: {
      async handler(newId) {
        this.meetup = null;
        this.fetchError = null;

        try {
          this.meetup = await fetchMeetupById(newId);
        } catch (error) {
          this.fetchError = error;
        }
      },
      immediate: true,
    },
  },

  template: `
    <div class="page-meetup">
      <MeetupView
        v-if="meetup"
        :meetup="meetup"
      />

      <UiContainer v-else-if="fetchError">
        <UiAlert> {{ this.fetchError.message }}</UiAlert>
      </UiContainer>

      <UiContainer v-else>
        <UiAlert>Загрузка...</UiAlert>
      </UiContainer>
    </div>`,
});
