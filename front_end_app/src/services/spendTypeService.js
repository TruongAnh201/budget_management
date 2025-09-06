import http from "@/services/httpCommon.js";
export default {
    async spendTypeList() {
        return http.get("/spend-type");
    },
    async spendTypeCreate(data){
      return http.post("/spend-type", data);
    },
    async spendTypeDelete(id){
      return http.delete("/spend-type/"+ id);
    },
    async spendTypeEdit(id,edit){
      return http.put("/spend-type/"+ id,edit);
    },
  };
