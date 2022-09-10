<template>
  <customdialog v-model="show" :persistent="commentMessage.length > 0">
    <template #title>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn icon color="accent" small @click="getComments">
          <v-icon>mdi-refresh-circle</v-icon>
        </v-btn>
      </v-row>
    </template>
    <template #content>
      <div v-if="comments && comments.length > 0" class="mb-3">
        <v-layout
          row
          v-for="(comment, index) in comments"
          :key="index"
          :align-start="comment.own"
          :align-content-start="comment.own"
          :align-end="!comment.own"
          :align-content-end="!comment.own"
          class="mb-3"
        >
          <v-flex
            xs8
            sm6
            md5
            :offset-xs4="comment.own"
            :offset-sm6="comment.own"
            :offset-md7="comment.own"
            class="pa-2 rounded-lg white--text"
            :class="{
              'text-right': comment.own,
              primary: comment.own,
              accent: !comment.own,
            }"
          >
            <b>{{ comment.by.name }}</b>
            <br />
            <p>{{ comment.message }}</p>
            <div class="text-right">
              <v-spacer></v-spacer>
              {{ comment.createdAt.slice(0, 10).replace(/-/g, ".") }}
              -
              {{ comment.createdAt.slice(12, 16) }}
            </div>
            <!-- <span class="text-right">{{ comment.createdAt }}</span> -->
          </v-flex>
        </v-layout>
      </div>
      <div v-else class="mb-3">
        <h3>Henüz yorum yok...</h3>
      </div>
      <v-divider></v-divider>
      <v-row class="mt-4 align-stretch">
        <v-textarea
          prepend-inner-icon="mdi-comment"
          outlined
          hide-details
          auto-grow
          rows="1"
          placeholder="Yorum..."
          v-model="commentMessage"
        />
        <v-btn
          @click.stop="createComment"
          class="ml-2"
          depressed
          :ripple="false"
          large
          color="primary"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-row>
    </template>
  </customdialog>
</template>

<script>
import customdialog from "@/components/CustomDialog";
import CommentService from "../services/CommentService";
export default {
  components: {
    customdialog,
  },

  props: {
    value: Boolean,
    documentId: String,
    model: String,
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },

  data() {
    return {
      commentMessage: "",
      comments: [],
    };
  },

  methods: {
    getComments() {
      this.loading = true;
      CommentService.GetComments(this.documentId, this.model).then(
        (comments) => {
          this.loading = false;
          comments = comments.map((c) =>
            c.by._id == this.$store.state.teacherId
              ? { ...c, own: true }
              : { ...c, own: false }
          );
          this.comments = comments;
        }
      );
    },

    createComment() {
      this.loading = true;
      const comment = {
        message: this.commentMessage,
        for: this.documentId,
        forModel: this.model,
        by: this.$store.state.teacherId,
        byModel: "Teacher",
      };
      CommentService.CreateComment(comment).then(() => {
        this.getComments();
        this.commentMessage = "";
      });
    },
  },

  watch: {
    show() {
      this.show && this.getComments();
    },
  },
};
</script>

<style>
</style>