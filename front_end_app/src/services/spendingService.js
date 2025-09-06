import http from "@/services/httpCommon.js";
export default {
    async spendingList() {
        return http.get("/spending");
    },
    async spendingCreate(data){
      return http.post("/spending", data);
    },
    async spendingDelete(id){
      return http.delete("/spending/"+ id);
    },
    async spendingEdit(id,edit){
      return http.put("/spending/"+ id,edit);
    },
  };
