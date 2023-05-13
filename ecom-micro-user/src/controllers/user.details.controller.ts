// src/UserDetailsController.ts

import { Body, Controller, Delete, Param, Post, Put, Response, Get } from "@nestjs/common";
import { UserDetailsService } from "../services";
import { NewUserDetails } from "../interfaces";
import { UserDetails } from "@prisma/client";
import { Response as ExpressResponse } from "express";

@Controller('/user/user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) { }

  @Post()
  async createUserDetails(
    @Body() newUserDetails: NewUserDetails,
    @Response() res: ExpressResponse) {

    try {
      const userDetails = await this.userDetailsService.createUserDetails(newUserDetails);
      res.json(userDetails);
    } catch (error) {
      res.status(400).json({ message: 'Error creating UserDetails', error });
    }

  };

  @Get('/:id')
  async findUserDetailsById(
    @Param('id') id: string,
    @Response() res: ExpressResponse) {

    try {
      const userDetails = await this.userDetailsService.findUserDetailsById(id);

      if (userDetails) {
        res.json(userDetails);
      } else {
        res.status(404).json({ message: 'UserDetails not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error retrieving UserDetails', error });
    }

  };

  @Put('/:id')
  async updateUserDetailsById(
    @Param('id') id: string,
    @Body() userDetailsBody: UserDetails,
    @Response() res: ExpressResponse) {

    try {
      const userDetails = await this.userDetailsService.updateUserDetails(id, userDetailsBody);

      if (userDetails) {
        res.json(userDetails);
      } else {
        res.status(404).json({ message: 'UserDetails not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error updating UserDetails', error });
    }

  };

  @Delete('/:id')
  async deleteUserDetailsById(
    @Param('id') id: string,
    @Response() res: ExpressResponse) {

    try {
      const userDetails = await this.userDetailsService.deleteUserDetails(id);

      if (userDetails) {
        res.json(userDetails);
      } else {
        res.status(404).json({ message: 'UserDetails not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error deleting UserDetails', error });
    }

  };
}
