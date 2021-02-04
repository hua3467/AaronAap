let People = function(fname, lname, department, city, title, website, image){
    this.firstName = fname,
    this.lastName = lname,
    this.department = department,
    this.city = city,
    this.title = title,
    this.website = website,
    this.profileImage = image,
    this.projects = [],
    this.addProjects = function(project){
        this.projects.push(project);
    }
}