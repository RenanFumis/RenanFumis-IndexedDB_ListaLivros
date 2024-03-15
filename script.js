

let bd;
let reqDB = indexedDB.open('meuDB', 1);
reqDB.onsuccess = () => {
  bd = reqDB.result
}
reqDB.onerror = () => {
  console.log(reqDB.error);
};

reqDB.onupgradeneeded = (e) =>{
  bd = reqDB.result;
  if(!bd.objectStoreNames.contains('livros')){
    let livrosOS = bd.createObjectStore('livros', {keyPath: 'id'})
  livrosOS.createIndex('tituloIDX', 'titulo', {unique: true})
  livrosOS.createIndex('autorIDX', 'autor', {unique: false})
  }
}


onload = () => {
  btnC.onclick = () => {
    let livro = {
      id: +livroId.value,
      titulo: titulo.value,
      autor: autor.value
    };
    let transacaoBD = bd.transaction(['livros'], 'readwrite');
    let livrosOS = transacaoBD.objectStore('livros');
    let reqOS = livrosOS.add(livro);

    reqOS.onsuccess = (e) => {
      console.log(reqOS.result);
    }
    reqOS.onerror = (e) =>{
      console.log(reqOS.error)
    }
    console.log(livro)
  }

  btnR.onclick = () =>{
    
    bd.transaction('livros')
    .objectStore('livros')
    .get(+livroId.value)

    .onsuccess = (e) => {
      titulo.value = e.target.result.titulo
      autor.value = e.target.result.autor
    }
  }
  btnD.onclick = () =>{
    
    bd.transaction(['livros'], 'readwrite')
    .objectStore('livros')
    .delete(+livroId.value)

    .onsuccess = (e) => {
      console.log('livro excluido')
    }
  }
  btnU.onclick = () =>{
    let livro = {
      id: +livroId.value,
      titulo: titulo.value,
      autor: autor.value
    };

    bd.transaction(['livros'], 'readwrite')
    .objectStore('livros')
    .put(livro)

    .onsuccess = (e) => {
      console.log('livro atualizado')
    }
  }

  btnL.onclick = () => {
    let lista = document.querySelector("#lista")
    lista.classList.add('ativa')
    lista.innerHTML = '' // Limpa a lista antes de adicionar os novos elementos
    // Adicionando a classe 'ativa' à ul

    bd.transaction('livros')
      .objectStore('livros')
      .openCursor()
      .onsuccess = (e) =>{
        let cursor = e.target.result;
        if(cursor){
          // Criando elementos HTML para exibir os valores
          const listItem = document.createElement('li')
          const livroIdSpan = document.createElement('span')
          const livroTitulo = document.createElement('span')
          const livroAutor = document.createElement('span')
  
          // Definindo os valores dos elementos criados com base
          livroIdSpan.textContent = cursor.value.id
          livroTitulo.textContent = cursor.value.titulo
          livroAutor.textContent = cursor.value.autor
  
          
          // Adicionando os elementos à lista
          listItem.appendChild(livroIdSpan)
          listItem.appendChild(document.createTextNode(' - ')) // Adicionando um separador
          listItem.appendChild(livroTitulo)
          listItem.appendChild(document.createTextNode(' - '))
          listItem.appendChild(livroAutor)
          lista.appendChild(listItem)
  
          cursor.continue()
        } else {
          console.log('Fim')
        }
      }
  }
  
  btnRT.onclick = () => {
    
    bd
    .transaction('livros')
    .objectStore('livros')
    .index('tituloIDX')
    .get(titulo.value)
    .onsuccess = (e) => {
      livroId.value = e.target.result.id
      titulo.value = e.target.result.titulo
      autor.value = e.target.result.autor
    }
  }
  btnRA.onclick = () => {
    bd
    .transaction('livros')
    .objectStore('livros')
    .index('autorIDX')
    .get(autor.value)
    .onsuccess = (e) => {
      livroId.value = e.target.result.id
      titulo.value = e.target.result.titulo
      autor.value = e.target.result.autor
    }
  }
}




