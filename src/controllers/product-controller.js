'use strict'
/*
* Já estão no Repository
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
*/
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config');
/*
exports.get = (req, res, next) => {
    repository
    .get()
    .then(data => {
        res.status(200).send(data);
    }).catch(e => {
        res.status(400).send(e);
    });
};
*/
exports.get = async(req, res, next) => {
    try {
        var data = await repository
        .get();
        
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }

};

exports.getBySlug = async(req, res, next) => {
    try {
        var data = await repository
        .getBySlug(req.params.slug);

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.getById = async(req, res, next) => {
    try {
        var data = await repository
        .getById(req.params.id);
            
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.getByTag = async(req, res, next) => {
    try {
        var data = await repository
        .getByTag(req.params.tag);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O Título deve conter no mínimo 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O Slug deve conter no mínimo 3 caracteres');    
    contract.hasMinLen(req.body.description, 3, 'A Descrição deve conter no mínimo 3 caracteres');   
    
    //Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        /*
        // Cria o Blob Service
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        // Salva a imagem
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-product.png'
            }
        });
        */

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags/*,
            image: 'https://nodestr.blob.core.windows.net/product-images/' + filename*/
        });
        res.status(201).send({
             message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            message: 'Falha ao cadastrar o produto',
            data: e
        });
    }
};
/*
exports.put = (req, res, next) => {
    const id = req.params.id;
    res.status(201).send({
        id: id,
        item: req.body
    });
};
*/
exports.put = async(req, res, next) => {
    try {
        await repository
        .update(req.params.id, req.body);
        res.status(201).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Falaha ao atualizar produto',
            data: error
        });
    }
};
/*
exports.delete = (req, res, next) => {

    res.status(200).send(req.body);
};
*/
exports.delete = async(req, res, next) => {
    try {
        await repository
        .delete(req.params.id);
        res.status(201).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Falaha ao remover produto',
            data: error
        });
    }
};