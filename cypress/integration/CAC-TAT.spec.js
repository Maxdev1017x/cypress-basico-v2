// CAC-TAT.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000
    beforeEach(function(){
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function() {

        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })


    it('Preenche os campos obrigatorios e enviar o form', function(){
        const longText = 'Testando, testando, testando, testando, testando, testando, testando, testando, testando, testando, testando, testando, testando,'

        cy.clock()

        cy.get('#firstName').type('Max')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('max@exemplo.com')
        cy.get('#open-text-area').type(longText, {delay: 0}) //sempre coloque delay zero em textos grandes
        cy.contains('button','Enviar').click()

        cy.get('.success').should('be.visible') //mostra o resultado do teste
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    })


    it('Exibe mensagem de erro ao submeter o form com um e-mail de formatação incorreta', function(){
        cy.clock()
        cy.get('#firstName').type('Max')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('max@exemplo,com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button','Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })


    it('Campo telefone continua vazio ao inserir valor não-numérico', function(){
        cy.get('#phone').type('abcd')
        .should('have.value', '')
    })


    it('Campo telefone se torna obrigatório, mas não foi preenchido antes do envio do form', function(){
        cy.clock()
        cy.get('#firstName').type('Max')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('max@exemplo,com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button','Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })


    it('Preenche e limpa os campos nome, e-mail e telefone', function(){
        cy.get('#firstName').type('Max').should('have.value', 'Max').clear().should('have.value', '')
        cy.get('#lastName').type('Oliveira').should('have.value', 'Oliveira').clear().should('have.value', '')
        cy.get('#email').type('max@exemplo.com').should('have.value', 'max@exemplo.com').clear().should('have.value', '')
        cy.get('#phone').type('40043399').should('have.value', '40043399').clear().should('have.value', '')
    })


    it('Exibe mensagem de erro ao submeter form sem preencher campos obrigatórios', function(){
        cy.clock()
        cy.contains('button','Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })


//Comando customizado
    it('Envia o form com um comando customizado', function(){
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    })


    it('Seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })


    it('Seleciona um produto (Mentoria) por seu valor', function() {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })


    it('Seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('Marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]').check().should('have.value','feedback')
    })


    it('Marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]')
        .should('have.length',3).each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })


    it('Marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]').check().should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })


    it('Seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })


    it('Seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'}) // essa parte do "action", simula que o usuario esta arrastando e soltando algum arquivo para anexar
        .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')
        })
    })


    it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
        .selectFile('@sampleFile')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })


    it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })


    it('Acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()

        cy.contains('Talking About Testing').should('be.visible')
    })
});

