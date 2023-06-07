import { Controller, Post, UseInterceptors, UploadedFile} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, uploadFileFilter } from './utils/file-upload.utils';
import { AppService } from './app.service';
import { ShdwDrive, ShadowFile } from "@shadow-drive/sdk";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller("shdw")
export class AppController {
  constructor(
    private configService: ConfigService,
  ) {}
  @Post('editFile')
  @UseInterceptors(
    FileInterceptor('file',{
      storage: diskStorage({
        destination: './nftData',
        filename: editFileName,
      }),
      fileFilter: uploadFileFilter
    }),
  )

  async editFile(@UploadedFile() file) {
    const key = this.configService.get("adm");
    const secretKey = new Uint8Array(key);
    let keypair = Keypair.fromSecretKey(secretKey);
    const connection = new Connection(
        clusterApiUrl("mainnet-beta"),
        "confirmed"
    );
    const wallet = new anchor.Wallet(keypair);
    const drive = await new ShdwDrive(connection, wallet).init();
    
    const storageAccount = this.configService.get("storageAccount")
    const acctPubKey = new anchor.web3.PublicKey(storageAccount);

    const fileBuff = fs.readFileSync(`./nftData/${file.filename}`);
    const fileToUpload: ShadowFile= {
      name: `${file.filename}`,
      file: fileBuff,
    };
    const url =
    `https://shdw-drive.genesysgo.net/${storageAccount}/${file.filename}`;

    try {
      const editFile = await drive.editFile(acctPubKey, url, fileToUpload, "v2");
      console.log(editFile)
      const response = {
        file: file.filename,
        location: editFile,
      }
      return response;
    } catch (error){
      return {
        errMessage:error.message,
      };
    }
    
  }

  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file',{
      storage: diskStorage({
        destination: './nftData',
        filename: editFileName,
      }),
      fileFilter: uploadFileFilter
    }),
  )

  async uploadFile(@UploadedFile() file) {
    const key = this.configService.get("adm");
    const secretKey = new Uint8Array(key);
    let keypair = Keypair.fromSecretKey(secretKey);
    const connection = new Connection(
        clusterApiUrl("mainnet-beta"),
        "confirmed"
    );
    const wallet = new anchor.Wallet(keypair);
    const drive = await new ShdwDrive(connection, wallet).init();
    
    const storageAccount = this.configService.get("storageAccount")
    const acctPubKey = new anchor.web3.PublicKey(storageAccount);

    const fileBuff = fs.readFileSync(`./nftData/${file.filename}`);
    const fileToUpload: ShadowFile= {
      name: `${file.filename}`,
      file: fileBuff,
    };

    try {
      const uploadFile = await drive.uploadFile(acctPubKey,fileToUpload);
      console.log(uploadFile)
      const response = {
        file: file.filename,
        location: uploadFile,
      }
      return response;
    } catch (error){
      return {
        errMessage:error.message,
      };
    }
  }
}

