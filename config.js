module.exports = {
  'secret': process.env.SECRET || '123456789',
  'database': process.env.MONGOLAB_URI || 'mongodb://localhost/myreader'
};