export const MUNICIPIOS = (cod: number): any => {
  return [
    {
      "codMunicipio": 310059,
      "nomMunicipio": "Uberlândia",
      "uf": {
        "id": 31,
        "sigla": "MG",
        "nome": "Minas Gerais"
      }
    }
  ].find(x => x.codMunicipio == cod)
}