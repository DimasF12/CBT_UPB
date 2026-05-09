import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const Login = () => import('@/views/auth/Login')
const Dashboard = () => import('@/views/dashboard/Dashboard')
const Layout = () => import('@/views/layout/App')
const MasterIndex = () => import('@/views/master/Index')

const UserIndex = () => import('@/views/master/user/Index')
const UserData = () => import('@/views/master/user/User')

const StudentIndex = () => import('@/views/master/student/Index')
const StudentData = () => import('@/views/master/student/Student')

const ClassroomIndex = () => import('@/views/master/classroom/Index')
const ClassroomData = () => import('@/views/master/classroom/Classroom')
const ClassroomMe = () => import('@/views/master/classroom/ClassroomMe')
const ClassroomSchedule = () => import('@/views/master/classroom/ClassroomSchedule')
const ClassroomDashboard = () => import('@/views/master/classroom/Dashboard')
const ClassroomLive = () => import('@/views/master/classroom/ClassroomLive')
const ClassroomLiveAdd = () => import('@/views/master/classroom/ClassroomLiveAdd')
const ClassroomJoin = () => import('@/views/master/classroom/ClassroomJoin')

const SubjectIndex = () => import('@/views/master/subject/Index')
const SubjectData = () => import('@/views/master/subject/Subject')
const SubjectMe = () => import('@/views/master/subject/SubjectMe')

const StandartIndex = () => import('@/views/standart/Index')
const StandartData = () => import('@/views/standart/Standart')

const PaperIndex = () => import('@/views/paper/Index')
const PaperDashboard = () => import('@/views/paper/Dashboard')

const LectureIndex = () => import('@/views/lecture/Index')
const LectureData = () => import('@/views/lecture/Lecture')
const LectureAdd = () => import('@/views/lecture/Add')
const LectureView = () => import('@/views/lecture/View')
const LectureEdit = () => import('@/views/lecture/Edit')
const LectureStudent = () => import('@/views/lecture/Student')

const TaskIndex = () => import('@/views/task/Index')
const TaskData = () => import('@/views/task/Task')
const TaskAdd = () => import('@/views/task/Add')
const TaskView = () => import('@/views/task/View')
const TaskEdit = () => import('@/views/task/Edit')
const TaskStudent = () => import('@/views/task/Student')
const TaskResult = () => import('@/views/task/Result')
const TaskCheck = () => import('@/views/task/Check')

const ReportIndex = () => import('@/views/report/Index')
const ReportAbcent = () => import('@/views/report/Abcent')

const SettingIndex = () => import('@/views/setting/Index')
const SettingDashboard = () => import('@/views/setting/Dashboard')
const SettingSchool = () => import('@/views/setting/School')

const EventIndex = () => import('@/views/event/Index')
const EventData = () => import('@/views/event/Event')
const EventShow = () => import('@/views/event/View')

const InfoIndex = () => import('@/views/info/Index')
const InfoData = () => import('@/views/info/Info')

const ExamIndex = () => import('@/views/exam/Index')
const ExamBank = () => import('@/views/exam/Bank')
const ExamBankQuestion = () => import('@/views/exam/question/Question')
const ExamBankQuestionAdd = () => import('@/views/exam/question/Add')
const ExamBankQuestionEdit = () => import('@/views/exam/question/Edit')
const ExamBankQuestionImport = () => import('@/views/exam/question/Import')
const ExamSchedule = () => import('@/views/exam/Schedule')
const ExamEsayCheck = () => import('@/views/exam/result/Check')
const ExamPoint = () => import('@/views/exam/result/Point')

const ExamLayout = () => import('@/views/layout/Exam')
const ExamDash = () => import('@/views/exam/student/Dashboard')
const ExamWait = () => import('@/views/exam/student/Waiting')
const ExamDoing = () => import('@/views/exam/student/Exam')
const ExamFinish = () => import('@/views/exam/student/Finish')

const RecapIndex = () => import('@/views/recap/Index')
const RecapDashboard = () => import('@/views/recap/Dashboard')

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/d'
      },
      {
        path: '/d',
        name: 'home',
        component: Dashboard,
      },
      {
        path: 'm',
        component: MasterIndex,
        children: [
          {
            path: 'u',
            component: UserIndex,
            children: [
              {
                path: '',
                name: 'master.user.index',
                component: UserData
              }
            ]
          },
          {
            path: 's',
            component: StudentIndex,
            children: [
              {
                path: '',
                name: 'master.student.index',
                component: StudentData
              }
            ]
          },
          {
            path: 'c',
            component: ClassroomIndex,
            children: [
              {
                path: '',
                name: 'master.classroom.index',
                component: ClassroomData
              },
              {
                path: 'me',
                name: 'master.classroom.me',
                component: ClassroomMe
              },
              {
                path: 'me/:id/sc',
                name: 'master.classroom.me.schedule',
                component: ClassroomSchedule
              },
              {
                path: ':id/d',
                name: 'master.classroom.dashboard',
                component: ClassroomDashboard
              },
              {
                path: 'live/:id',
                name: 'master.classroom.live',
                component: ClassroomLive
              },
              {
                path: ':id/live/add',
                name: 'master.classroom.live.add',
                component: ClassroomLiveAdd
              },
              {
                path: 'extraordinary',
                name: 'master.classroom.student',
                component: ClassroomDashboard
              },
              {
                path: 'join',
                name: 'master.classroom.join',
                component: ClassroomJoin
              }
            ]
          },
          {
            path: 'sub',
            component: SubjectIndex,
            children: [
              {
                path: '',
                name: 'master.subject.index',
                component: SubjectData
              },
              {
                path: 'me',
                name: 'master.subject.me',
                component: SubjectMe
              }
            ]
          }
        ]
      },
      {
        path: 'i',
        component: InfoIndex,
        children: [
          {
            path: '',
            name: 'info.index',
            component: InfoData
          }
        ]
      },
      {
        path: 'e',
        component: EventIndex,
        children: [
          {
            path: '',
            name: 'event.index',
            component: EventData
          },
          {
            path: ':id',
            name: 'event.view',
            component: EventShow
          }
        ]
      },
      {
        path: 'rt',
        component: StandartIndex,
        children: [
          {
            path: '',
            name: 'standart.index',
            component: StandartData
          }
        ]
      },
      {
        path: 'p',
        component: PaperIndex,
        children: [
          {
            path: '',
            name: 'paper.dashboard',
            component: PaperDashboard
          }
        ]
      },
      {
        path: 'l',
        component: LectureIndex,
        children: [
          {
            path: '',
            name: 'lecture.index',
            component: LectureData
          },
          {
            path: 'add',
            name: 'lecture.add',
            component: LectureAdd
          },
          {
            path: ':id/v',
            name: 'lecture.view',
            component: LectureView
          },
          {
            path: ':id/e',
            name: 'lecture.edit',
            component: LectureEdit
          },
          {
            path: 'extraordinary',
            name: 'lecture.student',
            component: LectureStudent
          }
        ]
      },
      {
        path: 't',
        component: TaskIndex,
        children: [
          {
            path: '',
            name: 'task.index',
            component: TaskData
          },
          {
            path: 'add',
            name: 'task.add',
            component: TaskAdd
          },
          {
            path: ':id/v',
            name: 'task.view',
            component: TaskView
          },
          {
            path: ':id/e',
            name: 'task.edit',
            component: TaskEdit
          },
          {
            path: ':id/c',
            name: 'task.check',
            component: TaskCheck
          },
          {
            path: ':id/r',
            name: 'task.result',
            component: TaskResult
          },
          {
            path: 'extraordinary',
            name: 'task.student',
            component: TaskStudent
          }
        ]
      },
      {
        path: 'r',
        component: ReportIndex,
        children: [
          {
            path: 'a',
            name: 'report.abcent',
            component: ReportAbcent
          }
        ]
      },
      {
        path: 'set',
        component: SettingIndex,
        children: [
          {
            path: '',
            name: 'setting.dashboard',
            component: SettingDashboard
          },
          {
            path: 'sch',
            name: 'setting.school',
            component: SettingSchool
          }
        ]
      },
      {
        path: 'ex',
        component: ExamIndex,
        children: [
          {
            path: 'bank',
            name: 'exam.bank',
            component: ExamBank
          },
          {
            path: 'bank/:id/q',
            name: 'exam.bank.questions',
            component: ExamBankQuestion
          },
          {
            path: 'bank/:id/q/add',
            name: 'exam.bank.question.add',
            component: ExamBankQuestionAdd
          },
          {
            path: 'bank/:id/q/:id_question/e',
            name: 'exam.bank.question.edit',
            component: ExamBankQuestionEdit
          },
          {
            path: 'bank/:id/i',
            name: 'exam.bank.question.import',
            component: ExamBankQuestionImport
          },
          {
            path: 'sc',
            name: 'exam.schedule',
            component: ExamSchedule
          },
          {
            path: 'sc/:id/c',
            name: 'exam.schedule.check',
            component: ExamEsayCheck
          },
          {
            path: 'sc/:id/point',
            name: 'exam.schedule.point',
            component: ExamPoint
          }
        ]
      },
      {
        path: '/r',
        component: RecapIndex,
        meta: { requiresAuth: true },
        children: [
          {
            path: 'd',
            name: 'recap.dashboard',
            component: RecapDashboard
          }
        ]
      }
    ]
  },
  {
    path: '/ex',
    component: ExamLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dash',
        name: 'exam.student',
        component: ExamDash
      },
      {
        path: 'wait',
        name: 'exam.prepare',
        component: ExamWait
      },
      {
        path: 'extraordinary',
        name: 'exam.while',
        component: ExamDoing
      },
      {
        path: 'finish',
        name: 'exam.finish',
        component: ExamFinish
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  store.commit('CLEAR_ERROR')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let auth = store.getters.isAuth
    if(!auth) {
      store.commit('SET_LOAD_PAGE', true)
      next({ name: 'login' })
    } else {
      store.commit('SET_LOAD_PAGE', true)
      next()
    }
  } else {
    store.commit('SET_LOAD_PAGE', true)
    next()
  }

})

router.afterEach(() => {
  store.commit('SET_LOAD_PAGE', false)
  store.commit('SET_LOADING', false)
})

export default router
