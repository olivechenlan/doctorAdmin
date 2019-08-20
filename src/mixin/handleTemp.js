export default {
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
    handleFilter() {
      if (this.listQuery.current) this.listQuery.current = 1
      this.getList()
    },
    resetTemp() {
      this.temp = this.$options.data().temp
      if (this.$refs.dataForm) this.$refs.dataForm.resetFields()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    getFile(e, param) {
      this.temp[param] = e
      this.$refs.dataForm.validateField(param)
    }
  }
}
