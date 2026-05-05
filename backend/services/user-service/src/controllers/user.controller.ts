// @ts-nocheck
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body
    
    const user = await prisma.user.create({
      data: { email, name, password }
    })
    
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = req.body
    
    const user = await prisma.user.update({
      where: { id },
      data
    })
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.user.delete({
      where: { id }
    })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
}
