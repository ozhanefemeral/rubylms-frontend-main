<template>
  <v-dialog v-model="show" max-width="700">
    <v-card>
      <v-card-title>
        <v-row>
          <v-icon>mdi-account</v-icon>
          {{ student.name }}
        </v-row>
        <br />
        <v-row>
          <v-icon>mdi-star</v-icon>
          {{ mark }}
        </v-row>
        <br />
        <v-row>
          <v-spacer></v-spacer>
          <v-btn @click="updateSolution" color="success">Save</v-btn>
        </v-row>
      </v-card-title>
      <v-card outlined v-for="(q, i) in task.questions" :key="i">
        <v-card-text class="text-subtitle-1" :class="compareAnswerText(q, i)">
          <v-row>
            <v-col cols="10">
              <span class="text-h4">{{ q.text }}</span>
              <span v-if="q.answerType === 'Test'">
                <br />
                <details class="white--text">
                  <summary>Choices</summary>
                  <ul>
                    <li v-for="(c, j) in q.choices" :key="j">
                      {{ q.choices[j] }}
                      <br />
                    </li>
                  </ul>
                </details>
                <span>Student Answer: {{ q.choices[solution.answers[i].value] }}</span>
                <br />
                <span>Student Answer: {{ q.choices[solution.answers[i].value] }}</span>
              </span>
              <span v-else>
                <br />
                <span>Student Answer: {{ solution.answers[i].value }}</span>
                <br />
                <span class="black--text">Answer: {{ q.answer }}</span>
                <br />
                <span>Student Answer: {{ solution.answers[i].value }}</span>
              </span>
              <span v-if="q.points">
                <br />
                Question Point: {{ q.points }}
              </span>
            </v-col>
            <v-col cols="2" justify="end" align="end">
              <v-icon size="3rem">{{ compareAnswerIcon(q, i) }}</v-icon>
              <br />
              <v-text-field type="number" v-model="solution.answers[i].points" outlined></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" :disabled="solution.mark == mark" @click="updateSolution">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TaskService from "../services/TaskService";
export default {
  props: ["solution", "student", "value", "task"],

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    mark() {
      let sum = 0;
      this.solution.answers.forEach((a) => {
        sum += parseFloat(a.points);
      });
      return sum;
    },
  },

  methods: {
    compareAnswerText(q, i) {
      const isCorrect = q.answer == this.solution.answers[i].value;
      return {
        "black--text": q.answer == undefined,
        "success--text": isCorrect,
        "error--text": !isCorrect,
      };
    },

    compareAnswerIcon(q, i) {
      const isCorrect = this.solution.answers[i].points > 0;
      return isCorrect ? "mdi-check-circle" : "mdi-close-circle";
    },

    updateSolution() {
      TaskService.UpdateSolution(this.solution._id, this.solution).then(
        (res) => {
          console.log(res.data);
        }
      );
    },
  },
};
</script>