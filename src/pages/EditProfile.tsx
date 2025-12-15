import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, User, Mail, Github, Linkedin, Twitter, Globe, ArrowLeft, Save, CheckCircle, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/user.service';

const editProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve ter no mínimo 3 caracteres')
    .max(30, 'Username deve ter no máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username pode conter apenas letras, números e underscore')
    .optional(),
  bio: z.string().max(500, 'Bio deve ter no máximo 500 caracteres').optional(),
  skills: z.string().optional(),
  github: z.string().url('URL inválida').optional().or(z.literal('')),
  linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
  twitter: z.string().url('URL inválida').optional().or(z.literal('')),
  portfolio: z.string().url('URL inválida').optional().or(z.literal('')),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: '',
      bio: '',
      skills: '',
      github: '',
      linkedin: '',
      twitter: '',
      portfolio: '',
    },
  });

  // Load current user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setIsLoadingProfile(true);
        const profile = await userService.getProfile();
        
        setValue('username', profile.username || '');
        setValue('bio', profile.bio || '');
        setValue('skills', profile.skills?.join(', ') || '');
        setValue('github', profile.socialLinks?.github || '');
        setValue('linkedin', profile.socialLinks?.linkedin || '');
        setValue('twitter', profile.socialLinks?.twitter || '');
        setValue('portfolio', profile.socialLinks?.portfolio || '');
        
        // Update auth store
        updateUser(profile);
      } catch (error) {
        toast({
          title: 'Erro ao carregar perfil',
          description: 'Não foi possível carregar seu perfil. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, toast, setValue, updateUser]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Por favor, selecione uma imagem (JPG, PNG ou GIF)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 2MB',
        variant: 'destructive',
      });
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Por favor, selecione uma imagem (JPG, PNG ou GIF)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB for cover)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A imagem de capa deve ter no máximo 5MB',
        variant: 'destructive',
      });
      return;
    }

    setCoverFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeCover = () => {
    setCoverPreview(null);
    setCoverFile(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: EditProfileFormData) => {
    setIsLoading(true);
    
    try {
      // Upload avatar if changed
      if (avatarFile) {
        await userService.uploadAvatar(avatarFile);
        toast({
          title: 'Avatar atualizado!',
          description: 'Sua foto de perfil foi alterada.',
        });
      }

      // Upload cover image if changed
      if (coverFile) {
        await userService.uploadCoverImage(coverFile);
        toast({
          title: 'Foto de capa atualizada!',
          description: 'Sua foto de capa foi alterada.',
        });
      }

      // Update profile data
      const updateData: any = {};
      
      if (data.username) updateData.username = data.username;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.skills) {
        updateData.skills = data.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }
      
      // Social links
      if (data.github || data.linkedin || data.twitter || data.portfolio) {
        updateData.socialLinks = {
          github: data.github || '',
          linkedin: data.linkedin || '',
          twitter: data.twitter || '',
          portfolio: data.portfolio || '',
        };
      }

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await userService.updateProfile(updateData);
        updateUser(updatedUser);
        
        toast({
          title: 'Perfil atualizado!',
          description: 'Suas informações foram salvas com sucesso.',
        });
      }
      
      navigate(`/users/${data.username || user?.username}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível atualizar o perfil.';
      
      toast({
        title: 'Erro ao atualizar perfil',
        description: errorMessage || 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => name?.slice(0, 2).toUpperCase() || 'U';

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayAvatar = avatarPreview || user.avatarUrl;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Perfil</h1>
            <p className="text-muted-foreground">Atualize suas informações pessoais</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Foto de Perfil</CardTitle>
            <CardDescription>Escolha uma foto que representa você</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar size="2xl">
                <AvatarImage src={displayAvatar || undefined} alt={user.username} />
                <AvatarFallback className="text-2xl">{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              {avatarPreview && (
                <Button 
                  type="button"
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  variant="destructive"
                  onClick={removeAvatar}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Alterar foto
                </Button>
                {avatarPreview && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={removeAvatar}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou GIF. Máximo 2MB.
              </p>
              {avatarPreview && (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Nova foto selecionada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cover Image Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Foto de Capa</CardTitle>
            <CardDescription>Personalize o topo do seu perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gradient-to-r from-primary to-secondary">
              {(coverPreview || user.coverImageUrl) && (
                <img 
                  src={coverPreview || user.coverImageUrl || undefined} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              )}
              {coverPreview && (
                <Button 
                  type="button"
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  variant="destructive"
                  onClick={removeCover}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-3">
              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => coverInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Alterar capa
                </Button>
                {coverPreview && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={removeCover}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou GIF. Máximo 5MB. Recomendado: 1200x400px
              </p>
              {coverPreview && (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Nova capa selecionada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
            <CardDescription>Suas informações públicas de perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="seu_username"
                    className="pl-10"
                    {...register('username')}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="pl-10 opacity-60"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <div className="relative">
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você, suas experiências e interesses..."
                  rows={4}
                  className="resize-none"
                  {...register('bio')}
                />
              </div>
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Máximo 500 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="React, TypeScript, Node.js (separadas por vírgula)"
                {...register('skills')}
              />
              <p className="text-xs text-muted-foreground">Separe suas habilidades por vírgula</p>
            </div>

            {/* Current level badge */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Nível atual:</span>
              <Badge variant="level">{user.level}</Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm font-medium text-primary">{user.reputation.toLocaleString()} reputação</span>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Links Sociais</CardTitle>
            <CardDescription>Conecte suas redes e portfólio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    className="pl-10"
                    {...register('github')}
                  />
                </div>
                {errors.github && (
                  <p className="text-sm text-destructive">{errors.github.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    className="pl-10"
                    {...register('linkedin')}
                  />
                </div>
                {errors.linkedin && (
                  <p className="text-sm text-destructive">{errors.linkedin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/username"
                    className="pl-10"
                    {...register('twitter')}
                  />
                </div>
                {errors.twitter && (
                  <p className="text-sm text-destructive">{errors.twitter.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfólio / Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="portfolio"
                    placeholder="https://seusite.com"
                    className="pl-10"
                    {...register('portfolio')}
                  />
                </div>
                {errors.portfolio && (
                  <p className="text-sm text-destructive">{errors.portfolio.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading || (!isDirty && !avatarFile)}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
