document.addEventListener('DOMContentLoaded',() => {
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => render(quote)))

    
    function render(quote) {
      const ul = document.querySelector('#quote-list')
      const li= document.createElement('li')
      const blockQuote = document.createElement('blockquote')
      const p = document.createElement('p')
      const footer = document.createElement('footer')
      const br = document.createElement('br')
      const likeBttn = document.createElement('button')
      const span = document.createElement('span')
      const delBttn = document.createElement('button')
      
      li.className ='quote-card'
      blockQuote.className = 'blockquote'
      p.className = `mb-${quote.id}`
      footer.className = 'blockquote-footer'
      likeBttn.className = 'btn-success'
      likeBttn.dataset.id = quote.id
      delBttn.className = 'btn-danger'
      delBttn.dataset.id = quote.id
      
      p.textContent = quote.quote
      footer.textContent = quote.author
      likeBttn.textContent = 'Likes: '
      span.textContent = quote.likes.length
      delBttn.textContent = 'Delete' 
      
      likeBttn.appendChild(span)
      blockQuote.append(p, footer, br, likeBttn, delBttn)
      li.append(blockQuote)
      ul.append(li)
      
      delBttn.addEventListener('click', e => {
        fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
          method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => li.remove() )
      })
      
      likeBttn.addEventListener('click', e=> {
        let newId = parseInt(e.target.dataset.id)
        fetch(`http://localhost:3000/likes`, {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            quoteId : newId
          })
        })
        .then(res=>res.json())
        .then(like => {
          quote.likes.push(like)
          span.textContent = quote.likes.length
        })
        
      })
    }
    
    const form = document.querySelector('#new-quote-form')
    form.addEventListener('submit', e=> {
      e.preventDefault()
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          quote : e.target.quote.value,
          author : e.target.author.value
        })
      })
      .then(r=>r.json())
      .then(quote => {
        quote.likes = [];
        render(quote)
      })
    })
    
  })