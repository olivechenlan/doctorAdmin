const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  departmentOptions: state => state.options.departmentOptions, // 科室
  titleOptions: state => state.options.titleOptions, // 职称
  hospitalOptions: state => state.options.hospitalOptions, // 机构
  topicOptions: state => state.options.topicOptions, // 栏目
  pathwayMajorOptions: state => state.options.pathwayMajorOptions, // 临时路径专业
  guideMajorOptions: state => state.options.guideMajorOptions
}
export default getters
