const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const database = require('../mongoose/expenseDB')
const whatsappResponse = database.collection('prodigal')
const Expense = require('../models/expense');


router.post('/api/expenses', async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;
        const expense = new Expense({ amount, category, date, description });
        await expense.save();
        res.status(201).send(expense);
    } catch (error) {
        res.status(500).send({ error: 'Failed to save expense' });
    }
});
  
router.get('/api/expenses', async (req, res) => {
    const { category } = req.query;
  
    try {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      const expenses = await Expense.find(query);
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Error fetching expenses' });
    }
  });

router.put('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, category, date, description } = req.body;
    try {
        const expense = await Expense.findByIdAndUpdate(
            id,
            { amount, category, date, description },
            { new: true, runValidators: true }
        );
        if (!expense) {
            return res.status(404).send({ error: 'Expense not found' });
        }
        res.status(200).send(expense);
    } catch (error) {
        res.status(500).send({ error: 'Failed to update expense' });
    }
});

router.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).send({ error: 'Expense not found' });
        }
        res.status(200).send({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete expense' });
    }
});

router.get('/api/reports/total-expenses-per-category', async (req, res) => {
    try {
      const totalExpensesPerCategory = await Expense.aggregate([
        { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } }
      ]);
      res.json(totalExpensesPerCategory);
    } catch (error) {
      console.error('Error fetching total expenses per category:', error);
      res.status(500).json({ message: 'Error fetching total expenses per category' });
    }
  });

  router.get('/api/reports/monthly-spending-trends', async (req, res) => {
    try {
      const monthlySpendingTrends = await Expense.aggregate([
        { $group: { _id: { month: { $month: "$date" }, year: { $year: "$date" } }, totalAmount: { $sum: "$amount" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
      res.json(monthlySpendingTrends);
    } catch (error) {
      console.error('Error fetching monthly spending trends:', error);
      res.status(500).json({ message: 'Error fetching monthly spending trends' });
    }
  });
  

module.exports = router