import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['departmentOptions', 'titleOptions', 'hospitalOptions'])
  },
  watch: {
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      getDepartment: 'options/getDepartment',
      getTitle: 'options/getTitle',
      getHospital: 'options/getHospital'
    }),
    getDefaultFromDepartment(id) {
      const departmentList = this.departmentOptions
      for (const i in departmentList) {
        if (departmentList[i].departmentId === id) {
          return [id]
        } else {
          for (const j in departmentList[i].subDeptList) {
            if (departmentList[i].subDeptList[j].departmentId === id) {
              return [departmentList[i].departmentId, departmentList[i].subDeptList[j].departmentId]
            }
          }
        }
      }
    },
    getDefaultFromTitle(id) {
      const titleList = this.titleOptions
      for (const i in titleList) {
        if (titleList[i].id === id) {
          return [id]
        } else {
          for (const j in titleList[i].subZcList) {
            if (titleList[i].subZcList[j].id === id) {
              return [titleList[i].id, titleList[i].subZcList[j].id]
            }
          }
        }
      }
    }
  }
}
