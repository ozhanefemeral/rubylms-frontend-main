<template>
  <div>
    <h1>Login</h1>
    <v-card raised>
      <v-card-text>
        <v-text-field label="Phone Number" v-model="phone"></v-text-field>
        <v-text-field
          label="Password"
          v-model="password"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      phone: "xxxxxxxxxxxxxxxxxxxxx",
      password: "xxxxxxxxxxxxxxxxxxxxx",
    };
  },

  methods: {
    login() {
      axios
        .post("/api/auth/login/teacher", {
          phone: this.phone,
          password: this.password,
        })
        .then((res) => res.data)
        .then(({ token, school, teacher }) => {
          this.$store.commit("setToken", token);
          this.$store.commit("setSchool", school);
          this.$store.commit("setTeacherId", teacher._id);
          console.log(teacher);
          this.$router.push({ name: "Home" });
        });
    },
  },
};
</script>

<style>
</style>