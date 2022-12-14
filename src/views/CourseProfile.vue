<template>
  <div>
    <!-- {{ showComments }} -->
    <div>
      <h1 v-if="course != undefined">
        {{ course.name }}
        <br />
      </h1>
      <h3>Course Average: {{ courseAverage }}</h3>
    </div>
    <v-divider></v-divider>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          tile
          class="mt-2 mr-2"
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="mr-2">mdi-magnify</v-icon>
          View
        </v-btn>
      </template>
      <v-list elevation="10">
        <v-list-item>
          <v-btn
            block
            tile
            color="primary"
            class="mr-2 mt-2"
            @click="showStudents = true"
          >
            View Students
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn
            block
            tile
            color="primary"
            class="mr-2 mt-2"
            @click="showComments = true"
          >
            View Comments
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn tile class="mt-2" color="accent" dark v-bind="attrs" v-on="on">
          <v-icon class="mr-2">mdi-pencil-outline</v-icon>
          Actions
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-btn
            tile
            block
            color="accent"
            class="mt-2 mr-2"
            @click="showCreateTask = true"
          >
            Create Homework
          </v-btn>
        </v-list-item>

        <v-list-item>
          <v-btn
            block
            tile
            color="accent"
            class="mr-2 mt-2"
            @click="showAllStudents = true"
          >
            Enroll Students
          </v-btn>
        </v-list-item>

        <v-list-item>
          <v-btn
            tile
            block
            color="accent"
            class="mr-2 mt-2"
            @click="showTeachers = true"
          >
            Change Teachers
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-divider class="mt-2"></v-divider>

    <customdialog v-if="course != undefined" v-model="showStudents">
      <template #content>
        <CustomTable
          :tableData="course.students"
          :headers="headers"
          :loading="loading"
          :viewItem="goStudentProfile"
        />
      </template>
    </customdialog>

    <customdialog v-if="course != undefined" v-model="showTeachers">
      <template #content>
        <v-card-text>
          <v-autocomplete
            label="Teachers"
            chips
            multiple
            :items="teachers"
            item-text="name"
            item-value="_id"
            v-model="selectedTeachers"
          >
          </v-autocomplete>
          <v-btn color="success" @click="changeTeachers">Save</v-btn>
        </v-card-text>
      </template>
    </customdialog>

    <customdialog v-model="showAllStudents">
      <template #content>
        <CustomTable
          :tableData="allStudents"
          :headers="headers"
          :loading="loading"
          :viewItem="goStudentProfile"
          selectable
          @itemSelected="onItemSelected"
        />
      </template>
      <template #actions>
        <v-btn color="success" @click="enrollStudents">Enroll Students</v-btn>
      </template>
    </customdialog>

    <CommentsDialog
      v-model="showComments"
      :documentId="courseId"
      model="Course"
    />

    <v-divider></v-divider>
    <v-row v-if="course != undefined">
      <v-col md="4" lg="3" v-for="(task, index) in course.tasks" :key="index">
        <v-card elevation="2" tile outlined>
          <v-card-text>
            <p class="text-center text-h4 primary--text">{{ task.name }}</p>
            <v-divider></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Responsibles</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  {{ task.responsibles.length }}
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Solutions</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  {{ task.solutions.length }}
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Average</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  {{ averages[index].toFixed(2) }}
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Created At:</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  {{
                    task.createdAt.substr(0, 10) +
                    " " +
                    task.createdAt.substr(11, 4)
                  }}
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-btn tile color="primary" @click="goTaskDetails(task)">
              <v-icon>mdi-magnify</v-icon>
              View Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <CreateTask
      v-model="showCreateTask"
      v-if="course != undefined"
      :students="course.students"
      :course="courseId"
    />
  </div>
</template>

<script>
import StudentService from "../services/StudentService";
import CourseService from "../services/CourseService";
import CreateTask from "@/components/CreateTask";
import CustomTable from "@/components/CustomTable";
import customdialog from "@/components/CustomDialog";
import TeacherService from "../services/TeacherService";
// import CommentService from "../services/CommentService";
import CommentsDialog from "../components/CommentsDialog";

export default {
  components: {
    CreateTask,
    CustomTable,
    customdialog,
    CommentsDialog,
  },

  data() {
    return {
      loading: true,
      courseId: "",
      commentMessage: "",
      course: undefined,
      averages: [],
      showCreateTask: false,
      showComments: false,
      showAllStudents: false,
      showStudents: false,
      showTeachers: false,
      allStudents: [],
      comments: [],
      selectedStudents: [],
      selectedTeachers: [],
      teachers: [],
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        {
          text: "Average",
          value: "average",
        },
      ],
    };
  },

  created() {
    this.courseId = this.$route.params.courseId;
    const populateBody = [
      {
        path: "tasks",
        model: "Task",
        select: ["_id", "name", "responsibles", "solutions", "createdAt"],
        populate: {
          path: "solutions",
          model: "Solution",
          select: ["mark", "student", "solvedAt"],
        },
      },
      { path: "students", model: "Student", select: ["_id", "name"] },
      { path: "teachers", model: "Teacher", select: ["_id", "name"] },
    ];
    CourseService.GetCourse(this.courseId, populateBody).then((course) => {
      this.selectedTeachers = course.teachers;
      course.tasks.forEach((task) => {
        let sum = 0;
        const solutionsLength = task.solutions.length;
        for (let i = 0; i < solutionsLength; i++) {
          const sol = task.solutions[i].mark;
          sum += sol;
        }

        const average = sum / solutionsLength;
        this.averages.push(average);
      });
      this.loading = false;

      let studentsLength = course.students.length;
      for (let i = 0; i < studentsLength; i++) {
        let student = course.students[i];
        let sum = 0;
        let solutions = [];

        course.tasks.forEach((c) => {
          solutions.push(
            ...c.solutions.filter((c) => c.student === student._id)
          );
        });

        solutions.forEach((s) => {
          sum += s.mark;
        });

        course.students[i].average = (sum / solutions.length).toFixed(2);
      }

      this.course = course;
    });
  },

  computed: {
    courseAverage() {
      let sum = 0;
      this.averages.forEach((el) => {
        if (!isNaN(el)) {
          sum += parseFloat(el);
        }
      });
      return (sum / this.averages.length).toFixed(2);
    },
  },

  methods: {
    // getComments() {
    //   this.loading = true;
    //   CommentService.GetComments(this.courseId, "Course").then((comments) => {
    //     this.loading = false;
    //     comments = comments.map((c) =>
    //       c.by._id == this.$store.state.teacherId
    //         ? { ...c, own: true }
    //         : { ...c, own: false }
    //     );
    //     this.comments = comments;
    //   });
    // },

    // createComment() {
    //   this.loading = true;
    //   const comment = {
    //     message: this.commentMessage,
    //     for: this.courseId,
    //     forModel: "Course",
    //     by: this.$store.state.teacherId,
    //     byModel: "Teacher",
    //   };
    //   CommentService.CreateComment(comment).then(() => {
    //     this.getComments();
    //     this.commentMessage = "";
    //   });
    // },

    onItemSelected(selected) {
      this.selectedStudents = selected;
    },

    enrollStudents() {
      let enrollPromises = [];
      this.selectedStudents.forEach((s) => {
        enrollPromises.push(
          StudentService.EnrollStudent(s._id, [this.courseId])
        );
      });

      Promise.all(enrollPromises).then((resolved) => {
        console.log(resolved);
      });
    },

    goTaskDetails(task) {
      this.$router.push({
        name: "TaskDetails",
        params: { task, taskId: task._id },
      });
    },

    goStudentProfile(student) {
      this.$router.push({
        name: "StudentProfile",
        params: { studentId: student._id },
      });
    },

    changeTeachers() {
      CourseService.UpdateCourse(this.courseId, {
        teachers: this.selectedTeachers,
      }).then((updatedCourse) => {
        console.log(updatedCourse);
      });
    },
  },

  watch: {
    showAllStudents() {
      if (this.showAllStudents && this.allStudents.length == 0) {
        this.loading = true;
        StudentService.GetAllStudents().then((allStudents) => {
          const ids = this.course.students.map((e) => e._id);
          let filtered = allStudents.filter((s) => {
            if (ids.includes(s._id)) {
              return false;
            }
            return true;
          });
          this.allStudents = filtered;
          this.loading = false;
        });
      }
    },

    showTeachers() {
      if (this.teachers.length == 0) {
        TeacherService.GetAllTeachers().then((teachers) => {
          this.teachers = teachers;
        });
      }
    },
  },
};
</script>