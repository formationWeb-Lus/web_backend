// Middleware 404 - route non trouvée
app.use((req, res, next) => {
  res.status(404).render('errors/404', { title: "Page Not Found" });
});

// Middleware gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('errors/500', { 
    title: "Server Error",
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {} // afficher stack en dev seulement
  });
});
