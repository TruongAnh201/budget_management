import http from "@/services/httpCommon.js";
export default {
    async userList() {
      return http.get("/users");
    },
    async userCreate(data){
      return http.post("/users", data);
    },
    async userDelete(id){
      return http.delete("/users/"+ id);
    },
    async userEdit(id,edit){
      return http.put("/users/"+ id,edit);
    },
    async userFind(id) {
      return http.get("/users/"+id);
    },
  };
