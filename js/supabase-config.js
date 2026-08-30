/* Curi Biodiversidade — conexão com o Supabase
   Estas chaves são públicas por natureza: o que protege os dados é o RLS
   configurado no banco (visitante só lê conteúdo e só grava evento). */

const SUPA = {
  url: "https://toblqihvfvdlvatvnswa.supabase.co",
  key: "sb_publishable_TBqycd_fLqcTFwss8II_Bg_nqVPLfec",
};

SUPA.rest = SUPA.url + "/rest/v1/";
SUPA.headers = {
  "apikey": SUPA.key,
  "Authorization": "Bearer " + SUPA.key,
  "Content-Type": "application/json",
};
